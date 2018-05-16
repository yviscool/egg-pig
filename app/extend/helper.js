'use strict';
require('reflect-metadata');


const REFLECTOR = Symbol('helper#reflector');

class Reflector {
  get(metadataKey, target) {
    return Reflect.getMetadata(metadataKey, target);
  }
}

module.exports = {
  get reflector() {
    if (!this[REFLECTOR]) {
      this[REFLECTOR] = new Reflector();
    }
    return this[REFLECTOR];
  },
};
