'use strict';
const DecoratorManager = require('../../lib/decorator_manager');
const REFLECTOR = Symbol('helper#reflector');

module.exports = {
  get reflector() {
    if (!this[REFLECTOR]) {
      this[REFLECTOR] = {
        get(metadataKey, target) {
          return DecoratorManager.getMetadata(metadataKey, target);
        },
      };
    }
    return this[REFLECTOR];
  },
};
