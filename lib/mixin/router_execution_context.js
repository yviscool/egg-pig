'use strict';

/**
 *  main
 */
module.exports = {
  createMethodsProxy(app) {
    this.logger = app.logger;
    this.controllerTarget = app.controller = {};
    const routers = this.load(app);
    routers.forEach(({ exports /* controller*/, routerName }) => {
      const routerProperties = this.scanForController(exports);
      this.applyPropertyToRouter(routerProperties, exports, routerName);
    });
  },

  applyPropertyToRouter(routerProperties, router, routerName) {
    routerProperties.forEach(routerProperty => {
      this.createCallbackProxy(routerProperty, router);
      this.createModules(router, routerProperty.method, routerName);
    });
  },

};
