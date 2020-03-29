'use strict';

const is = require('is-type-of');
const assert = require('assert');
const inflection = require('inflection');

const { path, safeRequire } = require('../utils');
const { REST_MAP, RequestMethod } = require('../constants');

const FileLoader = require('./file_loader');
const EggFileLoader = require('egg-core/lib/loader/file_loader');

const MiddlewareConsumer = require('../middleware');

const RouterProxy = require('../proxy/router_proxy');
const ContextCreator = require('../proxy/context_creator');
const ExceptionHandler = require('../proxy/exception_handler');
const RouterParamFactory = require('../proxy/router_param_factory');
const RouterExecutionContext = require('../proxy/router_execution_context');

const EggRouter = safeRequire('egg-core/lib/utils/router') || require('@eggjs/router').EggRouter;

const ConfigValidator = {

  validate(config) {
    return {
      globalPipes: this.validPipes(config.globalPipes),
      globalGuards: this.validGuards(config.globalGuards),
      globalFilters: this.validFilters(config.globalFilters),
      globalInterceptors: this.validInterceptors(config.globalInterceptors),
    };
  },

  validPipes(pipes = []) {
    assert(Array.isArray(pipes), 'global pipes should be array');
    return pipes.filter(pipe => pipe && (is.function(pipe) || is.function(pipe.transform)));
  },

  validGuards(guards = []) {
    assert(Array.isArray(guards), 'global guards should be array');
    return guards.filter(guard => guard && (is.function(guard) || is.function(guard.canActivate)));
  },

  validFilters(filters = []) {
    assert(Array.isArray(filters), 'global filters should be array');
    return filters.filter(filter => filter && (is.function(filter) || is.function(filter.catch)));
  },

  validInterceptors(interceptors = []) {
    assert(Array.isArray(interceptors), 'global interceptors should be array');
    return interceptors.filter(interceptor => interceptor && (is.function(interceptor) || is.function(interceptor.intercept)));
  },

};

module.exports = {

  reflector: {
    getClassMetadata(klass, methodOrMetadataKey, metadataKey) {
      return metadataKey
        ? Reflect.getMetadata(metadataKey, klass, methodOrMetadataKey)
        : Reflect.getMetadata(methodOrMetadataKey, klass);
    },
  },

  // router priority
  prioritySortRouters: [],


  loadToApp(directory, property, opt) {

    const target = this.app[property] = {};
    opt = Object.assign({}, {
      directory,
      target,
      inject: this.app,
    }, opt);

    const timingKey = `Load "${String(property)}" to Application`;
    this.timing.start(timingKey);
    // when load controller use custom fileloder
    if (property === 'controller') {
      const fileLoader = new FileLoader(opt);
      fileLoader.load();
      this.container = fileLoader.getRouters();
    } else {
      new EggFileLoader(opt).load();
    }
    this.timing.end(timingKey);
  },


  /**
   * create controller method proxy
   */
  createMethodsProxy() {

    const globalFeatures = ConfigValidator.validate(this.config);

    const { container, reflector } = this;
    const routerParamFactory = new RouterParamFactory();
    const contextCreator = new ContextCreator(globalFeatures, reflector);
    const routerProxy = new RouterProxy(contextCreator, ExceptionHandler, routerParamFactory, reflector);
    const routerExecutionContext = new RouterExecutionContext(container, routerProxy, reflector);

    // create controller method proxy
    routerExecutionContext.createMethodsProxy();
    // init routers globalprefix for middlewares, then egg/router require will have default properties
    MiddlewareConsumer.init(container, this.getGlobalPrefix());

    return this;

  },

  /**
   * register routers
   */
  resolveRouters() {

    for (const controllerDefinition of this.container.values()) {

      const { routerPaths, routerMetadata, properties } = controllerDefinition;

      const { name, prefix, isRestful, priority, routerOptions } = routerMetadata;

      if (!routerPaths.length && !isRestful) continue;

      // prefix ='/xxx/' => '/xxx'
      let basePath = prefix.replace(/\/$/, '');
      //  prefix = '/' then tranfrom into ''
      basePath = basePath.length === 1 ? '' : basePath;

      const router = this.createEggRouter(basePath, routerOptions);

      this.handlerWebMiddleware(routerOptions.middleware, middlewareImpl => {
        router.use(middlewareImpl);
      });

      for (const pathProperty of routerPaths) {

        const { path, method, paramOptions, requestMethod } = pathProperty;
        const methodMiddlewares = [];

        if (paramOptions) {
          this.handlerWebMiddleware(paramOptions.middleware, middlewareImpl => {
            methodMiddlewares.push(middlewareImpl);
          });
        }
        const targetcallback = this.getTargetCallback(properties, method);

        const routerArgs = paramOptions
          ? [paramOptions.routerName, path, ...methodMiddlewares, targetcallback].filter(x => x)
          : [path, ...methodMiddlewares, targetcallback];


        router[RequestMethod[requestMethod]].apply(router, routerArgs);
      }

      if (prefix && isRestful) {
        // resources verb
        this.register(properties, router, { name, prefix: '/' });
      }


      // const priority = Reflect.getMetadata(PRIORITY_METADATA, metatype);
      this.prioritySortRouters.push({ priority, router });
    }


    // implement @Piority
    this.app.beforeStart(() => {
      this.prioritySortRouters
        .sort((routerA, routerB) => routerB.priority - routerA.priority)
        .forEach(prioritySortRouter => {
          this.app.router.use(prioritySortRouter.router.routes());
        });
    });

  },


  // rewrite register because app.controller is not defined
  register(properties, router, { name, prefix }) {

    for (const key in REST_MAP) {

      let formatedName;
      const action = this.getTargetCallback(properties, key);

      const opts = REST_MAP[key];

      if (!action) continue;

      if (opts.member) {
        formatedName = inflection.singularize(name);
      } else {
        formatedName = inflection.pluralize(name);
      }

      if (opts.namePrefix) {
        formatedName = opts.namePrefix + formatedName;
      }

      const path = opts.suffix ? `${prefix}${opts.suffix}` : prefix;
      const method = Array.isArray(opts.method) ? opts.method : [opts.method];
      router.register(path, method, action, { name: formatedName });
    }

  },

  // get egg controller method
  getTargetCallback(properties, method) {
    properties.push(method);
    const targetCallback = path(properties.join('.'), this.app.controller);
    properties.pop();
    return targetCallback;
  },


  createEggRouter(basePath, routerOptions) {
    if (basePath) {
      const { sensitive = true } = routerOptions;
      const router = new EggRouter({ prefix: this.globalPrefix + basePath, sensitive }, this.app);
      return router;
    }

    return new EggRouter({ sensitive: true }, this.app);
  },


  handlerWebMiddleware(middlewares, handlerCallback) {
    if (middlewares && middlewares.length) {
      for (const m of middlewares) {
        let finalArgs;
        if (is.asyncFunction(m)) {
          finalArgs = m;
        } else if (is.function(m)) {
          if (m.name == '') {
            finalArgs = m();
          } else {
            finalArgs = m(this.app.config[m.name])
          }
        } else {
          finalArgs = this.app.middleware[m](this.app.config[m]);
        }
        handlerCallback(finalArgs);
      }
    }
  },

  getGlobalPrefix() {
    let path = this.globalPrefix = this.config.globalPrefix || '';
    assert(is.string(path), 'globalPrefix must be a string');
    const validatePath = path => (path.charAt(0) !== '/' ? '/' + path : path);
    path = path ? validatePath(path) : path;
    path = path ? path.replace(/\/$/, '') : path;
    this.globalPrefix = path;
    return path;
  },


};
