'use strict';

const FileLoader = require('./lib/file_loader');
const PigConsumer = require('./lib/consumer');
const RoutesResolver = require('./lib/routes_resolver');

module.exports = app => {

  if (app.config.eggpig.pig) {
    new FileLoader(app).load(routers => {
      PigConsumer.createMethodsProxy(routers, modules => {
        RoutesResolver.resolveRouters(modules, app);
      });
    });
  }

};
