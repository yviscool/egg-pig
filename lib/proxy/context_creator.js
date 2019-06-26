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

class ContextCreator {

  constructor(config = {}, reflector) {
    this.config = config;
    this.reflector = reflector;
  }

  createFeatures(controller, key) {
    return {
      pipes: this.createPipes(controller, key),
      guards: this.createGuards(controller, key),
      filters: this.createFilters(controller, key),
      interceptors: this.createInterceptors(controller, key),
    };
  }

  /**
   *
   * @param {Function} controller : controller
   * @param {string} key : controller method name
   * @return {object[]} proto: all of guardsprototype
   */
  createGuards(controller, key) {
    return this.create(controller, key, GUARDS_METADATA, this.loadInstanceForGuards);
  }

  createPipes(controller, key) {
    return this.create(controller, key, PIPES_METADATA, this.loadInstanceForPipes);
  }

  createInterceptors(controller, key) {
    return this.create(controller, key, INTERCEPTORS_METADATA, this.loadInstanceForInterceptors);
  }

  createFilters(controller, key) {
    return this.create(controller, key, EXCEPTION_FILTERS_METADATA, this.loadInstanceForFilters);
  }

  /**
   *
   * @param {Function} controller : controller
   * @param {string} key : controller method name
   * @param {String} metadata : metadata : such GUAED_METADATA
   * @param {string} loadInstanceFnc  : must implements method nmae : such 'canActivate'
   * @return {object[]} proto: guard prototype
   */
  create(controller, key, metadata, loadInstanceFnc) {
    const { getClassMetadata } = this.reflector;
    const globalMetadata = this.getGlobalMetadata(metadata);
    const classMetadata = getClassMetadata(controller, metadata);
    const methodMetadata = getClassMetadata(controller, key, metadata);
    return [
      ...this.getsFeaturesInstance(loadInstanceFnc, globalMetadata),
      ...this.getsFeaturesInstance(loadInstanceFnc, classMetadata),
      ...this.getsFeaturesInstance(loadInstanceFnc, methodMetadata),
    ];
  }

  // get pipes/guards/interceptors/filter instance
  getsFeaturesInstance(loadInstanceFnc, metadata) {
    if (is.nullOrUndefined(metadata)) return [];
    return metadata.map(loadInstanceFnc);
  }

  loadInstanceForGuards(injectable) {
    // injectable.name === '' means injectable is class {}
    const isValidGuard = (injectable.name || injectable.name === '') && !is.function(injectable.canActivate);
    return isValidGuard ? Object.create(injectable.prototype) : injectable;
  }

  loadInstanceForPipes(injectable) {
    const isValidPipe = (injectable.name || injectable.name === '') && !is.function(injectable.transform);
    return isValidPipe ? Object.create(injectable.prototype) : injectable;
  }

  loadInstanceForInterceptors(injectable) {
    const isValidInterceptor = (injectable.name || injectable.name === '') && !is.function(injectable.intercept);
    return isValidInterceptor ? Object.create(injectable.prototype) : injectable;
  }

  loadInstanceForFilters(injectable) {
    const isValidFilter = (injectable.name || injectable.name === '') && !is.function(injectable.catch);
    const protoInstance = Object.create(injectable.prototype || null);
    const exceptionMetatypes = (
      isValidFilter
        ? Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, injectable)
        : Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, Object.getPrototypeOf(injectable).constructor)
    ) || [];
    return isValidFilter
      ? Object.assign(protoInstance, { exceptionMetatypes })
      : Object.assign(injectable, { exceptionMetatypes });
  }

  getGlobalMetadata(metadata) {
    const config = this.config;
    if (metadata === GUARDS_METADATA) {
      return config.globalGuards;
    }
    if (metadata === PIPES_METADATA) {
      return config.globalPipes;
    }
    if (metadata === INTERCEPTORS_METADATA) {
      return config.globalInterceptors;
    }
    if (metadata === EXCEPTION_FILTERS_METADATA) {
      return config.globalFilters;
    }
  }


}


module.exports = ContextCreator;
