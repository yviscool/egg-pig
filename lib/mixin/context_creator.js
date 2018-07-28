'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const {
  GUARDS_METADATA,
  PIPES_METADATA,
  INTERCEPTORS_METADATA,
  EXCEPTION_FILTERS_METADATA,
  FILTER_CATCH_EXCEPTIONS,
} = require('../constants');

module.exports = {

  /**
   *
   * @param {Function} proto : controller.prototype
   * @param {string} key : controller method name
   * @return {object[]} proto: all of guardsprototype
   */
  createGuards(proto, key) {
    return this.create(proto, key, GUARDS_METADATA, this.loadInstanceForGuards);
  },

  createPipes(proto, key) {
    return this.create(proto, key, PIPES_METADATA, this.loadInstanceForPipes);
  },

  createInterceptors(proto, key) {
    return this.create(proto, key, INTERCEPTORS_METADATA, this.loadInstanceForInterceptors);
  },

  createFilters(proto, key) {
    return this.create(proto, key, EXCEPTION_FILTERS_METADATA, this.loadInstanceForFilters);
  },

  /**
   *
   * @param {Function} proto : controller.prototype
   * @param {string} key : controller method name
   * @param {String} metadata : metadata : such GUAED_METADATA
   * @param {string} loadInstanceFnc  : must implements method nmae : such 'canActivate'
   * @return {object[]} proto: guard prototype
   */
  create(proto, key, metadata, loadInstanceFnc) {
    const globalMetadata = this.getGlobalMetadata(metadata);
    const classMetadata = this.reflectClassMetadata(proto, metadata);
    const methodMetadata = this.reflectMethodMetadata(proto, key, metadata);
    return [
      ...this.getsFeaturesInstance(loadInstanceFnc, globalMetadata),
      ...this.getsFeaturesInstance(loadInstanceFnc, classMetadata),
      ...this.getsFeaturesInstance(loadInstanceFnc, methodMetadata),
    ];
  },

  // get pipes/guards/interceptors/filter instance
  getsFeaturesInstance(loadInstanceFnc, metadata) {
    if (is.nullOrUndefined(metadata)) return [];
    return metadata.map(loadInstanceFnc);
  },

  loadInstanceForGuards(metatype) {
    // metatype.name === '' means metatype is class {}
    return (metatype.name || metatype.name === '') && !is.function(metatype.canActivate)
      ? Object.create(metatype.prototype)
      : metatype;
  },

  loadInstanceForPipes(metatype) {
    return (metatype.name || metatype.name === '') && !is.function(metatype.transform)
      ? Object.create(metatype.prototype)
      : metatype;
  },

  loadInstanceForInterceptors(metatype) {
    return (metatype.name || metatype.name === '') && !is.function(metatype.intercept)
      ? Object.create(metatype.prototype)
      : metatype;
  },

  loadInstanceForFilters(metatype) {
    let exceptionMetatypes;
    if ((metatype.name || metatype.name === '') && !is.function(metatype.intercept)) {
      const protoInstance = Object.create(metatype.prototype);
      exceptionMetatypes = Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, metatype) || [];
      return Object.assign(protoInstance, { exceptionMetatypes });
    }
    exceptionMetatypes = Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, Object.getPrototypeOf(metatype).constructor) || [];
    return Object.assign(metatype, { exceptionMetatypes });
  },


  getGlobalMetadata(metadata) {
    const config = this._config || {};
    if (metadata === GUARDS_METADATA) {
      return config.globalGuards || [];
    }
    if (metadata === PIPES_METADATA) {
      return config.globalPipes || [];
    }
    if (metadata === INTERCEPTORS_METADATA) {
      return config.globalInterceptors || [];
    }
    if (metadata === EXCEPTION_FILTERS_METADATA) {
      return config.globalFilters || [];
    }
  },

  reflectClassMetadata(klass, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass.constructor);
  },

  reflectMethodMetadata(klass, key, metadataKey) {
    return Reflect.getMetadata(metadataKey, klass, key);
  },


};

