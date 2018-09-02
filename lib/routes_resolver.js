'use strict';

const { REST_MAP, RequestMethod } = require('./constants');
const inflection = require('inflection');
const EggRouter = require('egg-core/lib/utils/router');
const utils = require('./utils');


module.exports = {

  resolveRouters(app) {

    this.eggController = app.controller;
    this.globalPrefix = app.config.globalPrefix;

    for (const { routerPaths, routerMetadata, properties /* metatype*/ } of this.routers.values()) {

      const { name = '', prefix, isRestful } = routerMetadata || {};

      if (!routerPaths.length && !isRestful) continue;

      const router = this.createEggRouter(app);

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

      // prefix ='/xxx/' => '/xxx'
      let basePath = prefix.replace(/\/$/, '');
      //  prefix = '/' then tranfrom into ''
      basePath = basePath.length === 1 ? '' : basePath;

      // set globalPrefix
      const globalPrefix = this.globalPrefix ? this.globalPrefix : '';

      // ensure egg.router.verb before egg.router.use()
      app.beforeStart(() => {
        app.router.use(globalPrefix + basePath, router.routes());
      });

    }

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
    const targetCallback = utils.path(properties.join('.'), this.eggController);
    properties.pop();
    return targetCallback;
  },

  createEggRouter(app) {
    return new EggRouter({ sensitive: true }, app);
  },

  setRouters(routers) {
    this.routers = routers;
    return this;
  },


  get globalPrefix() {
    return this._globalPrefix;
  },

  set globalPrefix(path) {
    const validatePath = path => (path.charAt(0) !== '/' ? '/' + path : path);
    path = path ? validatePath(path) : path;
    path = path ? path.replace(/\/$/, '') : path;
    this._globalPrefix = path;
  },


};
