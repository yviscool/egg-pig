'use strict';
require('reflect-metadata');

const REFLECTOR = Symbol('helper#reflector');


module.exports = {
  get reflector(){
    if (!this[REFLECTOR]) {
      this[REFLECTOR] = {
        get(metadataKey, target) {
          return Reflect.getMetadata(metadataKey, target);
        }
      }
    }
    return this[REFLECTOR];
  }
};
