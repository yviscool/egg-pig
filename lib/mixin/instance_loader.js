'use strict';

/**
 *  loadinstance for guard/filter/piep/interceptor
 */
module.exports = {
  loadInstance(injectable) {
    const collection = this.injectables;
    let wrapper = collection.get(injectable.name);
    if (!wrapper) {
      wrapper = {
        name: injectable.name,
        metatype: injectable,
        instance: Object.create(injectable.prototype),
        isResolved: false,
      };
      collection.set(injectable.name, { ...wrapper });
    }
    return wrapper.instance;
  },
};

