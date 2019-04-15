'use strict';
// const is = require('is-type-of');
// const assert = require('assert');
// const FileLoader = require('./lib/file_loader');
// const ApplicationConfig = require('./lib/application_config');
const Application = require('./lib/consumer');
// const RoutesResolver = require('./lib/routes_resolver');

const { EggLoader } = require('egg-core');
// const utils = require('./lib/utils');
// const EggRouterModule = utils.require('egg-core/lib/utils/router');

// let EggRouter;

// if (!EggRouterModule) {
//   // support @eggjs/router
//   EggRouter = require('@eggjs/router').EggRouter;
// } else {
//   EggRouter = require('egg-core/lib/utils/router');
// }



module.exports = app => {


  EggLoader.prototype.loadController = function () {
    app.logger.info('[egg-pig] prevent default loadController success.');
  };


  if (app.config.eggpig.pig) {

    // const applicationConfig = new ApplicationConfig(eggApp);

    // const loader = new FileLoader(applicationConfig);

    new Application(app)
      .createMethodsProxy()
      .resolveRouters();

    // create controller method proxy 
    // application.routerExecutionContext.createMethodsProxy();
    // app.createMethodsProxy();

    // //  register router
    // RoutesResolver
    //   // .setRouters(applicationConfig.container)
    //   .resolveRouters(applicationConfig);

  }

};
