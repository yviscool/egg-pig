'use strict';
const is = require('is-type-of');
const convert = require('koa-convert');
const { utils, BaseContextClass } = require('egg-core');

const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');

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

  convertMiddleware(fn) {
    return is.generatorFunction(fn) ? convert(fn) : fn;
  },

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  methodToMiddleware(fn) {
    return function classControllerMiddleware(...args) {
      const controller = new BaseContextClass(this);
      return fn.call(controller, ...args);
    };
  },
};
