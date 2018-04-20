'use strict';

const path = require('path');
const PigConsumer = require('./lib/consumer');

module.exports = app => {


    if (app.config.eggpig.pig) PigConsumer.createMethodsProxy(app);
    if (app.config.eggpig.route) /*to do route*/;

};
