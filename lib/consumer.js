'use strict';

const FileLoader = require('./file_loader');
const RoutesResolver = require('./routes_resolver');
const ApplicationConfig = require('./application_config');
const MiddlewareConsumer = require('./middleware');

const RouterProxy = require('./mixin/router_proxy');
const ContextCreator = require('./mixin/context_creator');
const exceptionHandler = require('./mixin/exception_handler');
const RouterParamFactory = require('./mixin/router_param_factory');
const RouterExecutionContext = require('./mixin/router_execution_context');


class Application {
  /**
   *
   * @param {*} eggApp egg app instance
   */
  constructor(eggApp) {


    this.reflector = {
      reflectClassMetadata(klass, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass.constructor);
      },
      reflectMethodMetadata(klass, key, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass, key);
      },
    };

    this.config = new ApplicationConfig(eggApp);

    new FileLoader(this.config);

    this.routers = this.config.container;

  }

  createMethodsProxy() {

    const { config, routers, reflector } = this;
    const routerParamFactory = new RouterParamFactory();
    const contextCreator = new ContextCreator(config, reflector);
    const routerProxy = new RouterProxy(contextCreator, exceptionHandler, routerParamFactory, reflector);
    const routerExecutionContext = new RouterExecutionContext(routers, routerProxy, reflector);

    // create controller method proxy
    routerExecutionContext.createMethodsProxy();
    // initn routers globalprefix for middlewares
    MiddlewareConsumer.init(routers, config.getGlobalPrefix());

    return this;

  }

  resolveRouters() {
    new RoutesResolver(this.config).resolveRouters();
    // RoutesResolver.resolveRouters(this.config);
    return this;
  }
}


module.exports = Application;
