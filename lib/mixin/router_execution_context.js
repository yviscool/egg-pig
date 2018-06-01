'use strict';

/**
 *  main
 */
module.exports = {

  routerProperties: [],

  createMethodsProxy(routers, callback) {
    routers.forEach(({ exports /* controller*/, routerName }) => {
      this.scanForController(exports);
      this.applyPropertyToRouter(exports, routerName);
    });
    callback && callback(this.modules);
  },

  applyPropertyToRouter(router, routerName) {
    this.routerProperties.forEach(routerProperty => {
      this.createCallbackProxy(routerProperty, router);
      this.createModules(router, routerProperty.method, routerName);
    });
  },

};
