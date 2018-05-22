'use strict';
const is = require('is-type-of');
const {
  GUARDS_METADATA,
  PIPES_METADATA,
  INTERCEPTORS_METADATA,
  EXCEPTION_FILTERS_METADATA,
  FILTER_CATCH_EXCEPTIONS,
  ImplementMethods,
} = require('../constants');

module.exports = {

  /**
   *
   * @param {Function} proto : controller.prototype
   * @param {string} key : controller method name
   * @return {object[]} proto: all of guardsprototype
   */
  createGuards(proto, key) {
    return this.create(proto, key, GUARDS_METADATA, ImplementMethods.canActivate);
  },

  createPipes(proto, key) {
    return this.create(proto, key, PIPES_METADATA, ImplementMethods.transform);
  },

  createInterceptors(proto, key) {
    return this.create(proto, key, INTERCEPTORS_METADATA, ImplementMethods.intercept);
  },

  createFilters(proto, key) {
    return this.create(proto, key, EXCEPTION_FILTERS_METADATA, ImplementMethods.catch);
  },

  /**
   *
   * @param {Function} proto : controller.prototype
   * @param {string} key : controller method name
   * @param {String} metadata : metadata : such GUAED_METADATA
   * @param {string} method  : must implements method nmae : such 'canActivate'
   * @return {object[]} proto: guard prototype
   */
  create(proto, key, metadata, method) {
    const classMetadata = this.reflectClassMetadata(proto, metadata);
    const methodMetadata = this.reflectMethodMetadata(proto, key, metadata);
    return [
      ...this.getPigs(classMetadata, method),
      ...this.getPigs(methodMetadata, method),
    ];
  },

  // get pipes/guards/interceptors/filter instance
  getPigs(metadata, methoeName) {
    if (is.undefined(metadata) || is.null(metadata)) {
      return [];
    }
    if (methoeName === ImplementMethods.catch) {
      return metadata
        .filter(metatype => metatype && metatype.name)
        .map(metatype => {
          const instance = this.loadInstance(metatype);
          const exceptionMetatypes = Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, metatype) || [];
          return Object.assign(instance, { exceptionMetatypes });
        })
        .filter(pig => pig && is.function(pig[methoeName]));
    }
    return metadata
      .filter(metatype => metatype && metatype.name)
      .map(metatype => this.loadInstance(metatype))
      .filter(pig => pig && is.function(pig[methoeName]));

  },

};
