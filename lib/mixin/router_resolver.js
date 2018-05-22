'use strict';

const { REST_MAP } = require('../constants');
const inflection = require('inflection');
const EggRouter = require('egg-core/lib/utils/router');

const METADATA = Symbol.for('controller#metadata');
const CLASS = Symbol.for('controller#class');

module.exports = {
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
