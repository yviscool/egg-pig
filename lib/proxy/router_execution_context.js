'use strict';

// const {
// REST_MAP,
// PATH_METADATA,
// PRIORITY_METADATA,
// ROUTE_OPTIONS_METADATA,
// CONTROLLER_MODULE_METADATA,
// } = require('../constants');

// const DecoratorManager = require('../decorator_manager');


// const REST_VERB_ARR = Object.keys(REST_MAP);

/**
 *  main
 */
class RouterExecutionContext {


  constructor(routerProxy) {
    this.routerProxy = routerProxy;
  }

  createMethodsProxy() {

    // const controllerModules = DecoratorManager.listModule(CONTROLLER_MODULE_METADATA);

    // for (const controller of controllerModules) {
    //   Object.getOwnPropertyNames(proto)
    //     .filter(method => method !== 'constructor')
    //     .forEach(method => {
    //       const routerInfos = DecoratorManager.getMethodDataFromClass(ROUTE_OPTIONS_METADATA, controller, method);
    //       routerInfos.forEach(routerInfo => {
    //         this.routerProxy.createCallbackProxy({
    //           method: routerInfo.mehtod,
    //           targetCallback: controller[method],
    //         }, controller);
    //       });
    //     });
    //   //  .filter(method =>)
    // }


    // controllerModules.forEach(metatype=>{
    //   const routerProperties = this.scanForController(metatype);
    //   this.applyPropertyToRouter(routerProperties, metatype, fullpath);
    // });

    // this.routers.forEach(({ metatype, fullpath }) => {
    //   const routerProperties = this.scanForController(metatype);
    //   this.applyPropertyToRouter(routerProperties, metatype, fullpath);
    // });
  }

  // applyPropertyToRouter(routerProperties, router, fullpath) {
  //   routerProperties.forEach(routerProperty => {
  //     this.routerProxy.createCallbackProxy(routerProperty, router);
  //     this.resolveRouterPath(router, routerProperty.method, fullpath);
  //   });
  // }

  // scanForController(controller) {
  //   const ret = [];
  //   const { isRestful } = DecoratorManager.getClassMetadata(PATH_METADATA, controller);
  //   let proto = controller.prototype;
  //   while (proto !== Object.prototype) {
  //     const keys = Object.getOwnPropertyNames(proto).filter(name => name !== 'constructor');
  //     for (const key of keys) {

  //       const { path } = DecoratorManager.getClassMetadata(ROUTE_OPTIONS_METADATA, controller, key) || {};
  //       // method of controller does not have decorator
  //       if (!path && !isRestful) {
  //         continue;
  //       } else if (!path && !REST_VERB_ARR.some(name => name === key)) { /* methods(restController) not in rest.verbs*/
  //         continue;
  //       }

  //       const d = Object.getOwnPropertyDescriptor(proto, key);
  //       if (is.function(d.value)) {
  //         ret.push({
  //           method: key,
  //           targetCallback: proto[key],
  //         });
  //       }
  //     }
  //     proto = Object.getPrototypeOf(proto);
  //   }
  //   return ret;
  // }

  // resolveRouterPath(controller, method, fullpath) {

  //   const { getClassMetadata } = this.reflector;

  //   const priority = getClassMetadata(controller, PRIORITY_METADATA);
  //   const controlerMetadata = getClassMetadata(controller, PATH_METADATA);

  //   const paramOptions = getClassMetadata(controller, method, ROUTE_OPTIONS_METADATA) || {};

  //   const controllerWrapper = this.routers.get(fullpath);
  //   const routerPaths = controllerWrapper.routerPaths;

  //   if (!controlerMetadata.routerMetadata) {
  //     controllerWrapper.routerMetadata = { ...controlerMetadata, priority };
  //   }

  //   if (paramOptions.path && controlerMetadata) {
  //     // routerPaths.push({ path, method, routeName, requestMethod /* 0('get) 1('post') */ });
  //     routerPaths.push(paramOptions);
  //   }

  // }

}


module.exports = RouterExecutionContext;
