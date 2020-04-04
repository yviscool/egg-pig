'use strict';

const { EggLoader } = require('egg-core');

module.exports = () => {

  const defaultLoadController = EggLoader.prototype.loadController;

  EggLoader.prototype.loadController = function() {

    defaultLoadController.call(this);

    if (this.config.eggpig.pig) {

      // extends
      this.createMethodsProxy();
    }

  };

  Object.assign(EggLoader.prototype, require('./lib/loader/egg_loader'));

};
