'use strict';

const { REST_MAP, RequestMethod } = require('./constants');
const inflection = require('inflection');
const EggRouter = require('egg-core/lib/utils/router');
const utils = require('./utils');


const METADATA = Symbol.for('controller#metadata');
const CLASS = Symbol.for('controller#class');

module.exports = {

  resolveRouters(app) {

    for (const pathProperties of this.modules.values()) {

      const proto = pathProperties[CLASS].prototype;
      const { name = '', prefix, isRestful } = pathProperties[METADATA];

      if (!pathProperties.length && !isRestful) continue;

      const router = this.createRouter(app);

      for (const pathProperty of pathProperties) {
        const { path, method, routeName, requestMethod } = pathProperty;
        const targetcallback = utils.methodToMiddleware(proto[method]);
        const routerMethod = this.getRouterMethod(router, requestMethod);
        const args = routeName ? [ routeName, path, targetcallback ] : [ path, targetcallback ];
        routerMethod(...args);
      }

      if (prefix && isRestful) {
        // resources verb
        this.register(proto, router, { name, prefix: '/' });
      }

      // prefix ='/xxx/' => '/xxx'
      let basePath = prefix[prefix.length - 1] === '/' ? prefix.slice(0, prefix.length - 1) : prefix;
      //  prefix = '/' then tranfrom into ''
      basePath = basePath.length === 1 ? '' : basePath;
      // ensure egg.router.verb before egg.router.use()
      app.beforeStart(() => {
        app.router.use(basePath, router.routes());
      });

    }

  },

  // rewrite register because app.controller is not defined
  register(controller, router, { name, prefix }) {

    for (const key in REST_MAP) {

      let formatedName;
      let action = controller[key];
      const opts = REST_MAP[key];

      if (!action) continue;
      action = utils.methodToMiddleware(action);

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


  createRouter(app) {
    return new EggRouter({ sensitive: true }, app);
  },

  setModules(modules) {
    this.modules = modules;
  },

};
