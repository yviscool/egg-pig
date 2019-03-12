'use strict';

const RouterProxy = require('./mixin/router_proxy');
const ContextCreator = require('./mixin/context_creator');
const exceptionHandler = require('./mixin/exception_handler');
const RouterParamFactory = require('./mixin/router_param_factory');
const RouterExecutionContext = require('./mixin/router_execution_context');

const reflector = {

  reflectClassMetadata(klass, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass.constructor);
  },

  reflectMethodMetadata(klass, key, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass, key);
  },
};


class Consumer {

  constructor(config, routers) {
    this.config = config;
    this.routers = routers;
    const routerParamFactory = new RouterParamFactory();
    const contextCreator = new ContextCreator(config, reflector);
    const routerProxy = new RouterProxy(contextCreator, exceptionHandler, routerParamFactory, reflector);
    this.routerExecutionContext = new RouterExecutionContext(routers, routerProxy, reflector);
  }

}

module.exports = Consumer;
