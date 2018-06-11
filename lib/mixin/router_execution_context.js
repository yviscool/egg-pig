'use strict';

const is = require('is-type-of');
const {
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_NAME_METADATA,
} = require('../constants');

/**
 *  main
 */
module.exports = {


  createMethodsProxy() {
    const routers = this.getRouters();
    routers.forEach(({ metatype, fullpath }) => {
      const routerProperties = this.scanForController(metatype);
      this.applyPropertyToRouter(routerProperties, metatype, fullpath);
    });
  },

  applyPropertyToRouter(routerProperties, router, fullpath) {
    routerProperties.forEach(routerProperty => {
      this.createCallbackProxy(routerProperty, router);
      this.resolveRouterPath(router, routerProperty.method, fullpath);
    });
  },

  scanForController(controller) {
    const proto = controller.prototype;
    const isConstructor = method => method === 'constructor';
    return Object.getOwnPropertyNames(proto)
      .filter(method => is.function(proto[method]) && !isConstructor(method))
      .map(method => ({
        method,
        targetCallback: proto[method],
      }));
  },

  resolveRouterPath(controller, method, fullpath) {

    const proto = controller.prototype;
    const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
    const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
    const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
    const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);

    const controllerWrapper = this._routers.get(fullpath);

    if (!controllerWrapper.routerMetadata) {
      controllerWrapper.routerMetadata = controlerMetadata;
    }

    if (path && controlerMetadata) {
      controllerWrapper.routerPaths.push({
        path,
        method,
        routeName,
        requestMethod, // 0('get) 1('post') ..
      });
    }

  },

};
