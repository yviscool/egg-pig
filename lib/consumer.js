'use strict';

const FileLoader = require('./file_loader');
const RoutesResolver = require('./routes_resolver');
const ApplicationConfig = require('./application_config');

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
    // this.applicationConfig = new Applica
    const applicationConfig = new ApplicationConfig(eggApp);
    new FileLoader(applicationConfig);
    this.config = applicationConfig;
    this.routers = applicationConfig.container;
    this.reflector = {

      reflectClassMetadata(klass, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass.constructor);
      },

      reflectMethodMetadata(klass, key, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass, key);
      },

    };

    // this.routesResolver = Router
  }

  createMethodsProxy() {

    const { config, routers, reflector } = this;
    const routerParamFactory = new RouterParamFactory();
    const contextCreator = new ContextCreator(config, reflector);
    const routerProxy = new RouterProxy(contextCreator, exceptionHandler, routerParamFactory, reflector);
    const routerExecutionContext = new RouterExecutionContext(routers, routerProxy, reflector);

    // const applicationConfig = new ApplicationConfig(eggApp);

    // const loader = new FileLoader(applicationConfig);

    // const app = new Application(applicationConfig);

    // create controller method proxy 
    // application.routerExecutionContext.createMethodsProxy();
    // app.createMethodsProxy();

    routerExecutionContext.createMethodsProxy();
    //  register router

    return this;
  }

  resolveRouters() {
    RoutesResolver
      // .setRouters(applicationConfig.container)
      .resolveRouters(this.config);
  }
}



module.exports = Application;
