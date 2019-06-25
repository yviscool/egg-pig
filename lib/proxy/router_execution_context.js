'use strict';

const is = require('is-type-of');
const {
  REST_MAP,
  PATH_METADATA,
  METHOD_METADATA,
  PRIORITY_METADATA,
  ROUTE_NAME_METADATA,
} = require('../constants');


const REST_VERB_ARR = Object.keys(REST_MAP);

/**
 *  main
 */
class RouterExecutionContext {


  constructor(routers, routerProxy, reflector) {
    this.routers = routers;
    this.reflector = reflector;
    this.routerProxy = routerProxy;
  }

  createMethodsProxy() {
    this.routers.forEach(({ metatype, fullpath }) => {
      const routerProperties = this.scanForController(metatype);
      this.applyPropertyToRouter(routerProperties, metatype, fullpath);
    });
  }

  applyPropertyToRouter(routerProperties, router, fullpath) {
    routerProperties.forEach(routerProperty => {
      this.routerProxy.createCallbackProxy(routerProperty, router);
      this.resolveRouterPath(router, routerProperty.method, fullpath);
    });
  }

  scanForController(controller) {
    const ret = [];
    const { getClassMetadata } = this.reflector;
    const { isRestful } = getClassMetadata(controller, PATH_METADATA);
    let proto = controller.prototype;
    while (proto !== Object.prototype) {
      const keys = Object.getOwnPropertyNames(proto);
      for (const key of keys) {


        const path = getClassMetadata(controller, key, PATH_METADATA);

        if (key === 'constructor') {
          continue;
        } else if (!path && !isRestful) { /* mehtod of controlelr does not have decorator*/
          continue;
        } else if (!path && !REST_VERB_ARR.some(name => name === key)) { /* methods(restController) not in rest.verbs*/
          continue;
        }

        const d = Object.getOwnPropertyDescriptor(proto, key);
        if (is.function(d.value)) {
          ret.push({
            method: key,
            targetCallback: proto[key],
          });
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
    return ret;
  }

  resolveRouterPath(controller, method, fullpath) {

    const { getClassMetadata } = this.reflector;

    const priority = getClassMetadata(controller, PRIORITY_METADATA);
    const controlerMetadata = getClassMetadata(controller, PATH_METADATA);

    const path = getClassMetadata(controller, method, PATH_METADATA);
    const routeName = getClassMetadata(controller, method, ROUTE_NAME_METADATA);
    const requestMethod = getClassMetadata(controller, method, METHOD_METADATA);

    const controllerWrapper = this.routers.get(fullpath);
    const routerPaths = controllerWrapper.routerPaths;

    if (!controlerMetadata.routerMetadata) {
      controllerWrapper.routerMetadata = Object.assign(controlerMetadata, { priority });
    }

    if (path && controlerMetadata) {
      routerPaths.push({ path, method, routeName, requestMethod /* 0('get) 1('post') */ });
    }

  }

}


module.exports = RouterExecutionContext;
