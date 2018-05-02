'use strict';

const PigConsumer = require('./lib/consumer');

module.exports = app => {


  if (app.config.eggpig.pig) {
    PigConsumer.createMethodsProxy(app);
    PigConsumer.resolveRouters(app);
  }

};
