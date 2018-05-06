'use strict';
const is = require('is-type-of');
const path = require('path');
const convert = require('koa-convert');
const EggRouter = require('egg-core/lib/utils/router');
const inflection = require('inflection');
const { Observable } = require('rxjs/Observable');
const BaseContextClass = require('egg-core/lib/utils/base_context_class');
const {
  GUARDS_METADATA,
  PIPES_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
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

  // get pipes/guards/interceptors instance
  static getPigs(metadata, methoeName) {
    if (is.undefined(metadata) || is.null(metadata)) {
      return [];
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
      const { data, pipes } = args[typeAndIndex];
      arr.push({
        index,
        type,
        data,
        pipes,
        extractValue: this.extractValue(type, data),
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
        if (!resultValue) this.ctx.throw('Forbidden resource', 403);
      }
    };
  }

  static createPipesFn(pipes, callbackParamtypes, parmTypes, getPipeFn) {
    if (!callbackParamtypes || !callbackParamtypes.length) {
      return null;
    }
    return async function(args) {
      await Promise.all(callbackParamtypes.map(async param => {
        let { index, type, data, pipes: paramPipes, extractValue } = param;
        const value = await extractValue(this.ctx);
        const metaType = parmTypes[index];
        const paramType = RouteParamTypes[type];
        paramPipes = getPipeFn(paramPipes, ImplementMethods.transform);
        if (
          type === RouteParamTypes.QUERY ||
          type === RouteParamTypes.PARAM ||
          type === RouteParamTypes.BODY
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


  static createCallbackProxy({ proto, method, targetCallback }) {

    const guards = this.createGuards(proto, method);
    const context = this.createContext(proto, method);
    const canActivateFn = this.createGuardsFn(guards, context);

    const pipes = this.createPipes(proto, method);
    const paramTypes = this.reflectMethodMetadata(proto, method, PARAMTYPES_METADATA);
    const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
    const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes, this.getPigs.bind(this));


    const interceptors = this.createInterceptors(proto, method);
    const interceptorFn = this.createInterceptorsFn(interceptors, context);

    const finalHandler = this.createFinalHandler(proto, method);

    targetCallback = this.convertMiddleware(targetCallback);

    this.createModules(proto, method);

    Object.defineProperty(proto, method, {
      async value() {

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
      },
    }
    );
  }

  static createMethodsProxy(app) {
    const controllerModules = this.requireAll(app);
    const controllers = this.loadDeepModule(controllerModules);
    const routers = this.scanForControllers(controllers);
    routers.forEach(router => {
      this.createCallbackProxy(router);
    });
  }


  static requireAll(app) {
    return require('require-all')({
      dirname: path.join(app.baseDir, 'app/controller'),
      filter: /(.+)\.(ts|js)$/,
    });
  }

  static scanForControllers(controllers) {
    return controllers.reduce((arr, controller) => {
      const proto = controller.prototype;
      const router = Object.getOwnPropertyNames(proto)
        .filter(method => is.function(proto[method]) && method !== 'constructor')
        .map(method => (
          {
            proto,
            method,
            targetCallback: proto[method],
          }
        ));
      return arr.concat(router);
    }, []);
  }


  static loadDeepModule(modules) {
    return this.flatten(Object.values(modules)
      .map(module => {
        if (is.function(module)) {
          return module;
        }
        if (is.object) {
          return this.loadDeepModule(module);
        }
        return [];
      }));
  }

  static flatten(list) {
    return list.reduce((result, item) => {
      return is.array(item)
        ? [ ...result, ...this.flatten(item) ]
        : [ ...result, item ];
    }, []);
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

  static createModules(proto, method) {
    const name = proto.constructor.name;
    const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
    const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
    const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
    const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);
    const module = this.modules[name] ? this.modules[name] : this.modules[name] = [];
    module.metadata = controlerMetadata;
    if (path && controlerMetadata) {
      module.push({
        path,
        proto,
        method,
        routeName,
        requestMethod, // 0('get) 1('post') ..
      });
    }
  }

  static resolveRouters(app) {
    for (const key of Object.keys(this.modules)) {
      const pathProperties = this.modules[key];
      if (!pathProperties.length) continue;
      const { name = '', prefix, isRestful, proto } = pathProperties.metadata;
      const router = this.createRouter(app);
      for (const pathProperty of pathProperties) {
        const {
          path,
          proto,
          method,
          routeName,
          requestMethod,
        } = pathProperty;
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

Consumer.modules = {};
Consumer.injectables = new Map();

module.exports = Consumer;
