'use strict';
const { EggLoader } = require('egg-core');


/**
 *  prevent EggLoader default loadController/Service method;
 */
module.exports = {

  preventDefault() {
    this.preventDefaultController();
    this.preventDefaultService();
  },

  preventDefaultController() {
    const logger = this.logger;
    EggLoader.prototype.loadController = function() {
      logger.info('[egg-pig] prevent default loadController success.');
    };
  },

  preventDefaultService() {
    // const logger = this.logger;
    // EggLoader.prototype.loadService = function () {
    //   logger.info('prevent default loadSerivce success.')
    // }
  },

};
