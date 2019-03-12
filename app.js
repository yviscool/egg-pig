'use strict';

const FileLoader = require('./lib/file_loader');
const PigConsumer = require('./lib/consumer');
const RoutesResolver = require('./lib/routes_resolver');

module.exports = app => {

  if (app.config.eggpig.pig) {

    const loader = new FileLoader(app);

    const pigConsumer = new PigConsumer(loader.getConfig(), loader.getRouters());

    pigConsumer.routerExecutionContext.createMethodsProxy();

    RoutesResolver
      .setRouters(pigConsumer.routers)
      .resolveRouters(app);

  }

};
