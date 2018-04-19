'use strict';

const path = require('path');
const PigConsumer = require('./lib/consumer');

module.exports = app => {

    // require all controller
    const controllerModules = require('require-all')({
        dirname: path.join(app.baseDir, 'app/controller'),
        filter: /(.+)\.(ts|js)$/,
        recursive: true,
    });


    // create class method proxy 
    for (const module of Object.values(controllerModules)) {

        const controller = module.__esModule 
                    ? ('default' in module  ? module.default : module) 
                    : module ;

        PigConsumer.createMethodsProxy(controller, app)
    }

};
