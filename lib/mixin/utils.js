'use strict';
const is = require('is-type-of');
const convert = require('koa-convert');
const { utils, BaseContextClass } = require('egg-core');

module.exports = {

  // loadexports by egg.utils
  getExports(fullpath) { return utils.loadFile(fullpath); },

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

  reflectClassMetadata(klass, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass.constructor);
  },

  reflectMethodMetadata(klass, key, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass, key);
  },
};
