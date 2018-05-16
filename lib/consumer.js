'use strict';
const fs = require('fs');
const is = require('is-type-of');
const path = require('path');
const globby = require('globby');
const convert = require('koa-convert');
const EggRouter = require('egg-core/lib/utils/router');
const inflection = require('inflection');
const { Observable } = require('rxjs/Observable');
const { HttpException } = require('./exceptions/exception');
const { HttpStatus } = require('./exceptions/constant');
const { utils, BaseContextClass } = require('egg-core');
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
require('reflect-metadata');
require('rxjs/add/operator/toPromise');
require('rxjs/add/observable/defer');
require('rxjs/add/operator/take');


const METADATA = Symbol.for('controller#metadata');
const CLASS = Symbol.for('controller#class');
const PROTO = Symbol.for('controller#proto');


class Consumer {

  static createGuards(proto, key) {
    const classMetadata = this.reflectClassMetadata(proto, GUARDS_METADATA);
    const methodMetadata = this.reflectMethodMetadata(proto, key, GUARDS_METADATA);
    return [
      ...this.getPigs(classMetadata, ImplementMethods.canActivate),
      ...this.getPigs(methodMetadata, ImplementMethods.canActivate),
    ];
  }

  static createPipes(proto, key) {
    const classMetadata = this.reflectClassMetadata(proto, PIPES_METADATA);
    const methodMetadata = this.reflectMethodMetadata(proto, key, PIPES_METADATA);
    return [
      ...this.getPigs(classMetadata, ImplementMethods.transform),
      ...this.getPigs(methodMetadata, ImplementMethods.transform),
    ];

  }

  static createInterceptors(proto, key) {
    const classMetadata = this.reflectClassMetadata(proto, INTERCEPTORS_METADATA);
    const methodMetadata = this.reflectMethodMetadata(proto, key, INTERCEPTORS_METADATA);
    return [
      ...this.getPigs(classMetadata, ImplementMethods.intercept),
      ...this.getPigs(methodMetadata, ImplementMethods.intercept),
    ];
  }

  static createFilters(proto, key) {
    const classMetadata = this.reflectClassMetadata(proto, EXCEPTION_FILTERS_METADATA);
    const methodMetadata = this.reflectMethodMetadata(proto, key, EXCEPTION_FILTERS_METADATA);
    return [
      ...this.getPigs(classMetadata, ImplementMethods.catch),
      ...this.getPigs(methodMetadata, ImplementMethods.catch),
    ];
  }

  // get pipes/guards/interceptors instance
  static getPigs(metadata, methoeName) {
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

  }

  // loadinstance for pipe/guard/interceptor
  static loadInstance(injectable) {
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
  }

  static reflectClassMetadata(klass, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass.constructor);
  }

  static reflectMethodMetadata(klass, key, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass, key);
  }

  // get ctx(context/request,response,body/param/queyr/headers/seesion);
  static extractValue(key, data) {
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
  }

  // param 处理
  static reflectCallbackParamtypes(klass, key) {
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
  }


  static createGuardsFn(guards, context) {
    if (!guards || !guards.length) {
      return null;
    }
    return async function(req) {
      for (let guard of guards) {
        guard = Object.assign(guard, this);
        const resultValue = await guard.canActivate(req, context);
        if (!resultValue) { throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN); }
      }
    };
  }

  static createPipesFn(pipes, callbackParamtypes, parmTypes, getPipeFn, getCustomFactory) {
    if (!callbackParamtypes || !callbackParamtypes.length) {
      return null;
    }
    return async function(args) {
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
  }

  static createInterceptorsFn(interceptors, context) {
    return async function(req, callback, handler) {
      if (!interceptors || !interceptors.length) return await handler();
      const start$ = Observable.defer(async () => await transformValue(handler));
      const result$ = await interceptors.reduce(async (stream$, interceptor) => {
        interceptor = Object.assign(interceptor, this);
        return await interceptor.intercept(req, context, await stream$);
      }, Promise.resolve(start$));
      return await result$.toPromise();
    };

    async function transformValue(next) {
      const res = await next();
      const isDeffered = res instanceof Promise || res instanceof Observable;
      return isDeffered ? res : Promise.resolve(res);
    }
  }


  static createFinalHandler(proto, method) {
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
  }


  static createCallbackProxy({ controller, method, targetCallback }) {

    const proto = controller.prototype;

    const guards = this.createGuards(proto, method);
    const context = this.createContext(proto, method);
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
          canActivateFn && await canActivateFn.call(this, this.ctx.request);
          // pipe and targetcallback
          const handler = async () => {
            canTransformFn && await canTransformFn.call(this, args);
            return await targetCallback.apply(this, args);
          };
          // intercept
          const result = await interceptorFn.call(this, this.ctx.request, targetCallback, handler);
          await finalHandler(result, this.ctx);
        }
      },
    }
    );
  }

  static createExceptionHandler() {
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
        ctx.body = is.object(res) ? message : String(message);
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
        filter && filter.catch.call(app, exception, app.ctx);
        return !!filter;
      }
    }
    return new ExceptionHanlder();
  }


  static createMethodsProxy(app) {
    const routers = this.requireAll(app);
    routers.forEach(router => {
      this.createCallbackProxy(router);
      this.createModules(router);
    });
  }


  static requireAll(app) {
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

      if (exports == null) continue;

      const routers = this.scanForController(exports, routerName);
      // ignore exports when it's null or false returned by filter function
      items.push(...routers);
    }
    return items;
  }

  static getExports(fullpath) {
    return utils.loadFile(fullpath);
  }

  static scanForController(controller, controllerName) {
    if (is.object(controller)) {
      throw new Error(`controller ${controller} must be a class`);
    }
    const proto = controller.prototype;
    return Object.getOwnPropertyNames(proto)
      .filter(method => is.function(proto[method]) && method !== 'constructor')
      .map(method => (
        {
          controller,
          method,
          targetCallback: proto[method],
          controllerName,
        }
      ));
  }

  static getCustomFactory(factory) {
    return !is.undefined(factory) && is.function(factory)
      ? factory
      : () => null;
  }

  //  use context for guard/interceptor
  static createContext(proto, method) {
    return {
      parent: proto.constructor,
      handler: proto[method],
    };
  }

  static convertMiddleware(fn) {
    return is.generatorFunction(fn) ? convert(fn) : fn;
  }

  static createModules(router) {
    const { controller, method, controllerName } = router;
    const proto = controller.prototype;
    const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
    const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
    const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
    const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);

    let module = this.modules.get(controllerName);

    if (!module) {
      module = [];
      this.modules.set(controllerName, module);
    }

    module[PROTO] = proto;
    module[CLASS] = controller;
    module[METADATA] = controlerMetadata;

    if (path && controlerMetadata) {
      module.push({
        path,
        method,
        routeName,
        requestMethod, // 0('get) 1('post') ..
      });
    }
  }

  static resolveRouters(app) {
    for (const [ , pathProperties ] of this.modules.entries()) {
      if (!pathProperties.length) continue;
      const proto = pathProperties[PROTO];
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
  }

  static createRouter(app) {
    return new EggRouter({ sensitive: true }, app);
  }

  static getRouterMethod(router, method) {
    const methodName /* get, post..*/ = RequestMethod[method];
    return router[methodName].bind(router);
  }

  // rewrite register because app.controller is not defined
  static register(controller, router, { name, prefix }) {
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
  }

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  static methodToMiddleware(fn) {
    return function classControllerMiddleware(...args) {
      const controller = new BaseContextClass(this);
      return fn.call(controller, ...args);
    };
  }
}

Consumer.modules = new Map();
Consumer.injectables = new Map();

module.exports = Consumer;
