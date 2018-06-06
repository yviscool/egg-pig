'use strict';

/**
 *  main
 */
module.exports = {

  routerProperties: [],


  createMethodsProxy() {
    this.routers.forEach(({ exports /* controller*/, routerName }) => {
      this.scanForController(exports);
      this.applyPropertyToRouter(exports, routerName);
    });
  },

  applyPropertyToRouter(router, routerName) {
    this.routerProperties.forEach(routerProperty => {
      this.createCallbackProxy(routerProperty, router);
      this.createModules(router, routerProperty.method, routerName);
    });
  },


};
