'use strict';

const is = require('is-type-of');
const assert = require('assert');
const inflection = require('inflection');

const { path, safeRequire } = require('../utils');
const { REST_MAP, RequestMethod, PRIORITY_METADATA } = require('../constants');

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
    reflectClassMetadata(klass, metadataKey) {
      return Reflect.getMetadata(metadataKey, klass.constructor);
    },
    reflectMethodMetadata(klass, key, metadataKey) {
      return Reflect.getMetadata(metadataKey, klass, key);
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

    for (const { routerPaths, routerMetadata, properties, metatype } of this.container.values()) {

      const { name = '', prefix, isRestful } = routerMetadata || {};

      if (!routerPaths.length && !isRestful) continue;

      // prefix ='/xxx/' => '/xxx'
      let basePath = prefix.replace(/\/$/, '');
      //  prefix = '/' then tranfrom into ''
      basePath = basePath.length === 1 ? '' : basePath;

      const router = this.createEggRouter(basePath);

      for (const pathProperty of routerPaths) {
        const { path, method, routeName, requestMethod } = pathProperty;
        const targetcallback = this.getTargetCallback(properties, method);
        const routerMethod = this.getRouterMethod(router, requestMethod);
        const args = routeName ? [ routeName, path, targetcallback ] : [ path, targetcallback ];
        routerMethod(...args);
      }

      if (prefix && isRestful) {
        // resources verb
        this.register(properties, router, { name, prefix: '/' });
      }


      const priority = Reflect.getMetadata(PRIORITY_METADATA, metatype);
      this.prioritySortRouters.push({ priority, router });

      // // prefix ='/xxx/' => '/xxx'
      // let basePath = prefix.replace(/\/$/, '');
      // //  prefix = '/' then tranfrom into ''
      // basePath = basePath.length === 1 ? '' : basePath;

      // set globalPrefix
      // const globalPrefix = globalPrefix ? globalPrefix : '';
      // ensure egg.router.verb before egg.router.use()
      // this.app.beforeStart(() => {
      //   // app.router.use(globalPrefix + basePath, router.routes());
      //   this.app.router.use(router.routes());
      // });

    }

  },

  registerController() {
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
      const method = Array.isArray(opts.method) ? opts.method : [ opts.method ];
      router.register(path, method, action, { name: formatedName });
    }

  },

  /**
     *  get router method
     * @param {object} router : egg router instance
     * @param {number} method , type of RequestMethod
     * @return {function} router[verb].bind(router)
     */
  getRouterMethod(router, method) {
    const methodName /* get, post..*/ = RequestMethod[method];
    return router[methodName].bind(router);
  },

  // get egg controller method
  getTargetCallback(properties, method) {
    properties.push(method);
    const targetCallback = path(properties.join('.'), this.app.controller);
    properties.pop();
    return targetCallback;
  },

  /**
     * @param {string} basePath is @Controller(path) path
     * @return {EggRouter} EggRouter
     */
  createEggRouter(basePath) {
    if (basePath) {
      return new EggRouter({ sensitive: true, prefix: this.globalPrefix + basePath }, this.app);
    }
    return new EggRouter({ sensitive: true }, this.app);
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
