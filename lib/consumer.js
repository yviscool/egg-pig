'use strict';
const fs = require('fs');
const is = require('is-type-of');
const path = require('path');
const globby = require('globby');
const convert = require('koa-convert');
const EggRouter = require('egg-core/lib/utils/router');
const inflection = require('inflection');
const { HttpStatus } = require('./exceptions/constant');
const { HttpException } = require('./exceptions/exception');
const { utils, BaseContextClass } = require('egg-core');
const { Observable, defer, from } = require('rxjs');
const { take, switchMap } = require('rxjs/operators');
const {
  GUARDS_METADATA,
  PIPES_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
  EXCEPTION_FILTERS_METADATA,
  FILTER_CATCH_EXCEPTIONS,
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_NAME_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
  ImplementMethods,
  RouteParamTypes,
  RequestMethod,
  REST_MAP,
} = require('./constants');

take;

const METADATA = Symbol.for('controller#metadata');
const CLASS = Symbol.for('controller#class');


const ContextCreator = {

  createGuards(proto, key) {
    return this.create(proto, key, GUARDS_METADATA, ImplementMethods.canActivate);
  },

  createPipes(proto, key) {
    return this.create(proto, key, PIPES_METADATA, ImplementMethods.transform);
  },

  createInterceptors(proto, key) {
    return this.create(proto, key, INTERCEPTORS_METADATA, ImplementMethods.intercept);
  },

  createFilters(proto, key) {
    return this.create(proto, key, EXCEPTION_FILTERS_METADATA, ImplementMethods.catch);
  },

  create(proto, key, metadata, method) {
    const classMetadata = this.reflectClassMetadata(proto, metadata);
    const methodMetadata = this.reflectMethodMetadata(proto, key, metadata);
    return [
      ...this.getPigs(classMetadata, method),
      ...this.getPigs(methodMetadata, method),
    ];
  },

  // get pipes/guards/interceptors/filter instance
  getPigs(metadata, methoeName) {
    if (is.undefined(metadata) || is.null(metadata)) {
      return [];
    }
    if (methoeName === ImplementMethods.catch) {
      return metadata
        .filter(metatype => metatype && metatype.name)
        .map(metatype => {
          const instance = this.loadInstance(metatype);
          const exceptionMetatypes = Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, metatype) || [];
          return Object.assign(instance, { exceptionMetatypes });
        })
        .filter(pig => pig && is.function(pig[methoeName]));
    }
    return metadata
      .filter(metatype => metatype && metatype.name)
      .map(metatype => this.loadInstance(metatype))
      .filter(pig => pig && is.function(pig[methoeName]));

  },

};


// loadinstance for pipe/guard/interceptor/filter
const InstanceLoader = {
  loadInstance(injectable) {
    const collection = this.injectables;
    let wrapper = collection.get(injectable.name);
    if (!wrapper) {
      wrapper = {
        name: injectable.name,
        metatype: injectable,
        instance: Object.create(injectable.prototype),
        isResolved: false,
      };
      collection.set(injectable.name, { ...wrapper });
    }
    return wrapper.instance;
  },
};


const CommonUtils = {

  // loadexports by egg.utils
  getExports(fullpath) { return utils.loadFile(fullpath); },

  convertMiddleware(fn) {
    return is.generatorFunction(fn) ? convert(fn) : fn;
  },

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  methodToMiddleware(fn) {
    return function classControllerMiddleware(...args) {
      const controller = new BaseContextClass(this);
      return fn.call(controller, ...args);
    };
  },

  reflectClassMetadata(klass, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass.constructor);
  },

  reflectMethodMetadata(klass, key, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass, key);
  },

};

//  1. createMethodxProxy
//  2. createModules
const RouterExecutionContext = {
  createMethodsProxy(app) {
    const routers = this.requireAll(app);
    routers.forEach(({ router, routerName }) => {
      const routerProperties = this.scanForController(router);
      this.applyPropertyToRouter(routerProperties, router, routerName);
    });
  },

  applyPropertyToRouter(routerProperties, router, routerName) {
    routerProperties.forEach(routerProperty => {
      this.createCallbackProxy(routerProperty, router);
      // create modules for descorator router phase
      this.createModules(router, routerProperty.method, routerName);
    });
  },

};

// scanner app/controller directory
const Scannner = {
  requireAll(app) {
    const files =
      (process.env.EGG_TYPESCRIPT === 'true' && require.extensions['.ts'])
        ? [ '**/*.(js|ts)', '!**/*.d.ts' ]
        : [ '**/*.js' ];
    const directory = path.join(app.baseDir, 'app/controller');
    const filepaths = globby.sync(files, { cwd: directory });
    const items = [];
    for (const filepath of filepaths) {
      const fullpath = path.join(directory, filepath);
      if (!fs.statSync(fullpath).isFile()) continue;

      const exports = this.getExports(fullpath);

      const baseName = path.basename(fullpath); //  foo.ts/js
      const routerName = baseName.substring(0, baseName.indexOf('.')); // foo
      // routername is use for middlreconsumer key;
      if (exports == null) continue;
      items.push({ router: exports, routerName });
    }
    return items;
  },

  scanForController(controller) {
    if (is.function(controller)) {
      // to do: controller is function
    }
    const proto = controller.prototype;
    return Object.getOwnPropertyNames(proto)
      .filter(method => is.function(proto[method]) && method !== 'constructor')
      .map(method => (
        {
          method,
          targetCallback: proto[method],
        }
      ));
  },
};

// createmodules f
const ModuleCreator = {
  createModules(controller, method, controllerName) {
    const proto = controller.prototype;
    const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
    const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
    const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
    const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);

    let module = this.modules.get(controllerName);

    if (!module) {
      module = [];
      this.modules.set(controllerName, module);
      module[CLASS] = controller;
      module[METADATA] = controlerMetadata;
    }

    if (path && controlerMetadata) {
      module.push({
        path,
        method,
        routeName,
        requestMethod, // 0('get) 1('post') ..
      });
    }
  },
};


const RouterParamFactory = {
  // get ctx(context/request,response,body/param/queyr/headers/seesion);
  extractValue(key, data) {
    return async function(ctx) {
      switch (key) {
        case RouteParamTypes.CONTEXT:
          return ctx;
        case RouteParamTypes.REQUEST:
          return ctx.request;
        case RouteParamTypes.RESPONSE:
          return ctx.response;
        case RouteParamTypes.BODY:
          return data && ctx.request.body ? ctx.request.body[data] : ctx.request.body;
        case RouteParamTypes.PARAM:
          return data ? ctx.params[data] : ctx.params;
        case RouteParamTypes.QUERY:
          return data ? ctx.query[data] : ctx.query;
        case RouteParamTypes.HEADERS:
          return data ? ctx.headers[data] : ctx.headers;
        case RouteParamTypes.SESSION:
          return ctx.session;
        case RouteParamTypes.FILE:
          return ctx.getFileStream && await ctx.getFileStream();
        case RouteParamTypes.FILES:
          return ctx.multipart && ctx.multipart(data);
        default:
          return null;
      }
    };
  },

  getRouterMethod(router, method) {
    const methodName /* get, post..*/ = RequestMethod[method];
    return router[methodName].bind(router);
  },
};

// create exceptionhandler
const ExceptionHandler = {
  createExceptionHandler() {
    class ExceptionHanlder {
      next(exception, app) {
        const { ctx } = app;
        if (this.invokeCustomFilters(exception, app)) return;
        // common throw error
        if (!(exception instanceof HttpException)) {
          throw exception;
        }
        // custom exception which extends HttpException
        const res = exception.getResponse();
        const message = is.object(res)
          ? res
          : {
            statusCode: exception.getStatus(),
            message: res,
          };

        app.ctx.status = exception.getStatus();
        if (is.null(message) || is.undefined(message)) {
          ctx.body = '';
          return;
        }
        ctx.body = is.object(message) ? message : String(message);
        return;
      }

      setCustomFilters(filters = []) {
        this.filters = filters;
      }

      invokeCustomFilters(exception, app) {
        if (!this.filters.length) return false;
        const filter = this.filters.find(filter => {
          const exceptionMetatypes = filter.exceptionMetatypes;
          const hasMetatype =
            !exceptionMetatypes.length ||
            !!exceptionMetatypes.find(
              ExceptionMetatype => exception instanceof ExceptionMetatype
            );
          return hasMetatype;
        });
        filter && filter.catch.call(app, exception);
        return !!filter;
      }

    }
    return new ExceptionHanlder();
  },
};

const RouterProxy = {
  // param 处理
  reflectCallbackParamtypes(klass, key) {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, klass, key) || [];
    return Object.keys(args).reduce((arr, typeAndIndex) => {
      const [ type, index ] = typeAndIndex.split(':');
      const { data, pipes, factory } = args[typeAndIndex];
      arr.push({
        index,
        type,
        extractValue: this.extractValue(type, data),
        data,
        pipes,
        factory,
      });
      return arr;
    }, []);
  },


  createGuardsFn(guards, context) {
    if (!guards || !guards.length) {
      return null;
    }
    return async function tryActivate() {
      for (let guard of guards) {
        guard = Object.assign(guard, this);
        const result = await guard.canActivate(context);
        if (await pickResult(result)) {
          continue;
        } else {
          throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        }
      }
    };

    async function pickResult(result) {
      if (result instanceof Observable) {
        return await result.toPromise();
      }
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }
  },


  createPipesFn(pipes, callbackParamtypes, parmTypes, getPipeFn, getCustomFactory) {
    if (!callbackParamtypes || !callbackParamtypes.length) {
      return null;
    }
    return async function apply(args) {
      await Promise.all(callbackParamtypes.map(async param => {
        let value;
        let { index, type, data, pipes: paramPipes, factory, extractValue } = param;
        const metaType = parmTypes[index];
        const paramType = RouteParamTypes[type];
        paramPipes = getPipeFn(paramPipes, ImplementMethods.transform);
        if (factory) {
          value = getCustomFactory(factory)(data, this.ctx);
        } else {
          value = await extractValue(this.ctx);
        }
        if (
          type === RouteParamTypes.QUERY ||
          type === RouteParamTypes.PARAM ||
          type === RouteParamTypes.BODY ||
          is.string(type)
        ) {
          args[index] = await getParamValue.call(this,
            pipes.concat(paramPipes),
            value,
            {
              data,
              metaType,
              type: paramType,
            });
        } else {
          args[index] = value;
        }
      }));
    };

    async function getParamValue(pipes, value, metadata) {
      return await pipes.reduce(async (value, pipe) => {
        const val = await value;
        pipe = Object.assign(pipe, this);
        const result = pipe.transform(val, metadata);
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }, Promise.resolve(value));
    }
  },

  createInterceptorsFn(interceptors, context) {
    return async function intercept(handler) {
      if (!interceptors || !interceptors.length) return await handler();
      const start$ = defer(() => transformValue(handler));
      const result$ = await interceptors.reduce(async (stream$, interceptor) => {
        interceptor = Object.assign(interceptor, this);
        return await interceptor.intercept(context, await stream$);
      }, Promise.resolve(start$));
      return await result$.toPromise();
    };

    function transformValue(next) {
      return from(next()).pipe(
        switchMap(res => {
          const isDeffered = res instanceof Promise || res instanceof Observable;
          return isDeffered ? res : Promise.resolve(res);
        })
      );
    }
  },


  createFinalHandler(proto, method) {
    const renderTemplate = this.reflectMethodMetadata(proto, method, RENDER_METADATA);
    const responseHeaders = this.reflectMethodMetadata(proto, method, HEADER_METADATA) || [];

    // render
    if (renderTemplate) {
      return async (result, ctx) => {
        setHeaders(responseHeaders, ctx);
        result = await transformToResult(result);
        await ctx.render(renderTemplate, result);
      };
    }

    return async (result, ctx) => {
      setHeaders(responseHeaders, ctx);
      result = await transformToResult(result);
      if (is.nullOrUndefined(result)) {
        return;
      }
      ctx.body = result;
    };

    function setHeaders(headers, ctx) {
      headers.forEach(({ name, value }) => {
        ctx.set(name, value);
      });
    }

    async function transformToResult(resultOrDeffered) {
      if (resultOrDeffered instanceof Promise) {
        return await resultOrDeffered;
      } else if (resultOrDeffered && is.function(resultOrDeffered.subscribe)) {
        return await resultOrDeffered.toPromise();
      }
      return resultOrDeffered;
    }
  },

  // for custom decorators
  getCustomFactory(factory) {
    return !is.undefined(factory) && is.function(factory)
      ? factory
      : () => null;
  },

  //  use context for guard/interceptor
  createContext(proto, method) {
    return {
      getClass() {
        return proto.constructor;
      },
      getHandler() {
        return proto[method];
      },
    };
  },

  createCallbackProxy({ method, targetCallback }, controller) {

    const proto = controller.prototype;

    const guards = this.createGuards(proto, method);
    const context = this.createContext(proto, targetCallback);
    const canActivateFn = this.createGuardsFn(guards, context);

    const getPig = this.getPigs.bind(this);
    const getCustomFactory = this.getCustomFactory.bind(this);
    const pipes = this.createPipes(proto, method);
    const paramTypes = this.reflectMethodMetadata(proto, method, PARAMTYPES_METADATA);
    const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
    const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes, getPig, getCustomFactory);

    const interceptors = this.createInterceptors(proto, method);
    const interceptorFn = this.createInterceptorsFn(interceptors, context);

    const finalHandler = this.createFinalHandler(proto, method);

    const filters = this.createFilters(proto, method);
    const exceptionHanlder = this.createExceptionHandler();
    exceptionHanlder.setCustomFilters(filters);

    targetCallback = this.convertMiddleware(targetCallback);

    Object.defineProperty(proto, method, {
      async value() {

        try {

          await callbackProxy.call(this);

        } catch (e) {

          exceptionHanlder.next(e, this);

        }

        async function callbackProxy() {
          const args = Array.apply(null, { length: callbackParamtypes.length }).fill(null);
          // guard
          canActivateFn && await canActivateFn.call(this);
          // pipe and targetcallback
          const handler = async () => {
            canTransformFn && await canTransformFn.call(this, args);
            return await targetCallback.apply(this, args);
          };
          // intercept
          const result = await interceptorFn.call(this, handler);
          console.log(result);
          await finalHandler(result, this.ctx);
        }
      },
    }
    );
  },
};

const RouterResolver = {
  resolveRouters(app) {
    for (const [ , pathProperties ] of this.modules.entries()) {
      if (!pathProperties.length) continue;
      const proto = pathProperties[CLASS].prototype;
      const { name = '', prefix, isRestful } = pathProperties[METADATA];
      const router = this.createRouter(app);
      for (const pathProperty of pathProperties) {
        const { path, method, routeName, requestMethod } = pathProperty;
        const targetcallback = this.methodToMiddleware(proto[method]);
        const routerMethod = this.getRouterMethod(router, requestMethod);
        const args = routeName ? [ routeName, path, targetcallback ] : [ path, targetcallback ];
        routerMethod(...args);
      }
      if (prefix && isRestful) {
        // resources verb
        this.register(proto, router, { name, prefix: '/' });
      }
      // ensure egg.router.verb before egg.router.use()
      app.beforeStart(() => {
        app.router.use(prefix, router.routes());
      });
    }
  },

  // rewrite register because app.controller is not defined
  register(controller, router, { name, prefix }) {
    for (const key in REST_MAP) {
      let action = controller[key];
      if (!action) continue;
      action = this.methodToMiddleware(action);
      const opts = REST_MAP[key];
      let formatedName;
      if (opts.member) {
        formatedName = inflection.singularize(name);
      } else {
        formatedName = inflection.pluralize(name);
      }
      if (opts.namePrefix) {
        formatedName = opts.namePrefix + formatedName;
      }
      const path = opts.suffix ? `${prefix}${opts.suffix}` : prefix;
      const method = Array.isArray(opts.method) ? opts.method : [ opts.method ];
      router.register(path, method, action, { name: formatedName });
    }
  },

  createRouter(app) {
    return new EggRouter({ sensitive: true }, app);
  },

};


const Consumer = {
  modules: new Map(),
  injectables: new Map(),
};

const loaders = [
  Scannner,
  RouterExecutionContext,
  ModuleCreator,
  CommonUtils,
  ContextCreator,
  InstanceLoader,
  RouterParamFactory,
  ExceptionHandler,
  RouterProxy,
  RouterResolver,
];

for (const loader of loaders) {
  Object.assign(Consumer, loader);
}


module.exports = Consumer;
