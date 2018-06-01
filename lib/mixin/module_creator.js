'use strict';

const METADATA = Symbol.for('controller#metadata');
const CLASS = Symbol.for('controller#class');

const {
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_NAME_METADATA,
} = require('../constants');


/**
 * create modules ;
 * modules is use for decorating router
 */
module.exports = {

  createModules(controller, method, controllerName) {

    const proto = controller.prototype;
    const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
    const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
    const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
    const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);

    let module = this.modules.get(controllerName);

    if (!module) {
      module = [];
      this.modules.set(controllerName, module);
      module[CLASS] = controller;
      module[METADATA] = controlerMetadata;
    }

    if (path && controlerMetadata) {
      module.push({
        path,
        method,
        routeName,
        requestMethod, // 0('get) 1('post') ..
      });
    }

  },

};
