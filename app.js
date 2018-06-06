'use strict';

const FileLoader = require('./lib/file_loader');
const PigConsumer = require('./lib/consumer');
const RoutesResolver = require('./lib/routes_resolver');

module.exports = app => {

  if (app.config.eggpig.pig) {

    const loader = new FileLoader(app);

    PigConsumer.setRouters(loader.getRouters());
    PigConsumer.setConfig(loader.getConfig());
    PigConsumer.createMethodsProxy();

    RoutesResolver.setModules(PigConsumer.getModules());
    RoutesResolver.resolveRouters(app);

  }

};
