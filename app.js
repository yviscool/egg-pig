'use strict';
const Application = require('./lib/consumer');
const { EggLoader } = require('egg-core');

module.exports = app => {

  EggLoader.prototype.loadController = function() {
    app.logger.info('[egg-pig] prevent default loadController success.');
  };


  if (app.config.eggpig.pig) {

    new Application(app)
      .createMethodsProxy()
      .resolveRouters();

  }

};
