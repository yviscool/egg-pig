'use strict';
const co = require('co');
const is = require('is-type-of');
const { utils } = require('egg-core');

const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');

const MissingRequiredDependency = (name, reason) =>
  `The "${name}" package is missing. Please, make sure to install this library ($ npm install ${name}) to take advantage of ${reason}.`;

module.exports = {

  // loadexports by egg.utils
  loadController(fullpath, opt) {
    const exports = utils.loadFile(fullpath);
    if (is.class(exports)) {
      exports.prototype.pathName = opt.pathName;
      exports.prototype.fullPath = opt.path;
      return [ exports, this.wrapClass(exports) ];
    }
    if (
      (is.function(exports) && !is.class(exports))
      || is.generatorFunction(exports)
      || is.asyncFunction(exports)
      || is.object(exports)
    ) {
      throw new Error(`Does not support controlller is a common function or object ${exports.name}`);
    }
    return [ exports ];
  },

  wrapClass(controller) {
    let proto = controller.prototype;
    const ret = {};
    // tracing the prototype chain
    while (proto !== Object.prototype) {
      const keys = Object.getOwnPropertyNames(proto);
      for (const key of keys) {
        // getOwnPropertyNames will return constructor
        // that should be ignored
        if (key === 'constructor') {
          continue;
        }
        // skip getter, setter & non-function properties
        const d = Object.getOwnPropertyDescriptor(proto, key);
        // prevent to override sub method
        if (is.function(d.value) && !ret.hasOwnProperty(key)) {
          ret[key] = this.methodToMiddleware(controller, key);
          ret[key][FULLPATH] = controller.prototype.fullPath + '#' + controller.name + '.' + key + '()';
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
    return ret;
  },

  convertGeneratorFunction(fn) {
    return is.generatorFunction(fn) ? co.wrap(fn) : fn;
  },

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  methodToMiddleware(Controller, key) {
    return function classControllerMiddleware(...args) {
      const controller = new Controller(this);
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [ this ];
      }
      // return fn.call(controller, ...args);
      return utils.callFn(controller[key], args, controller);
    };
  },

  loadPackage(packageName, context) {
    try {
      return require(packageName);
    } catch (e) {
      console.error(MissingRequiredDependency(packageName, context));
      process.exit(1);
    }
  },

};


function path(pathArr, obj) {
  if (arguments.length === 1) {
    return function(objHolder) {
      return path(pathArr, objHolder);
    };
  }
  if (obj === null || obj === undefined) {
    return undefined;
  }
  let willReturn = obj;
  let counter = 0;

  const pathArrValue = typeof pathArr === 'string' ? pathArr.split('.') : pathArr;

  while (counter < pathArrValue.length) {
    if (willReturn === null || willReturn === undefined) {
      return undefined;
    }
    willReturn = willReturn[pathArrValue[counter]];
    counter++;
  }

  return willReturn;
}

module.exports.path = path;
