'use strict';
require('reflect-metadata');

class DecoratorManager extends Map {


  constructor() {
    super();
    /**
         * the key for meta data store in class
         */
    this.injectClassKeyPrefix = 'INJECTION_CLASS_META_DATA';
    /**
         * the key for method meta data store in class
         */
    this.injectClassMethodKeyPrefix = 'INJECTION_CLASS_METHOD_META_DATA';

    /**
         * the key for method meta data store in method
         */
    this.injectMethodKeyPrefix = 'INJECTION_METHOD_META_DATA';
  }

  saveModule(key, module) {
    if (!this.has(key)) {
      this.set(key, new Set());
    }
    this.get(key).add(module);
  }

  static getDecoratorClassKey(decoratorNameKey) {
    return decoratorNameKey.toString() + '_CLS';
  }

  static getDecoratorMethodKey(decoratorNameKey) {
    return decoratorNameKey.toString() + '_METHOD';
  }

  static getDecoratorClsMethodPrefix(decoratorNameKey) {
    return decoratorNameKey.toString() + '_CLS_METHOD';
  }

  static getDecoratorClsMethodKey(decoratorNameKey, methodKey) {
    return DecoratorManager.getDecoratorClsMethodPrefix(decoratorNameKey) + ':' + methodKey.toString();
  }

  listModule(key) {
    return Array.from(this.get(key) || {});
  }

  static getOriginMetadata(metaKey, target, method) {
    if (method) {
      // for property
      if (!Reflect.hasMetadata(metaKey, target, method)) {
        Reflect.defineMetadata(metaKey, new Map(), target, method);
      }
      return Reflect.getMetadata(metaKey, target, method);
    }
    // filter Object.create(null)
    if (typeof target === 'object' && target.constructor) {
      target = target.constructor;
    }
    // for class
    if (!Reflect.hasMetadata(metaKey, target)) {
      Reflect.defineMetadata(metaKey, new Map(), target);
    }
    return Reflect.getMetadata(metaKey, target);

  }

  saveMetadata(decoratorNameKey, data, target, propertyName) {
    if (propertyName) {
      const originMap = DecoratorManager.getOriginMetadata(this.injectMethodKeyPrefix, target, propertyName);
      originMap.set(DecoratorManager.getDecoratorMethodKey(decoratorNameKey), data);
    } else {
      const originMap = DecoratorManager.getOriginMetadata(this.injectClassKeyPrefix, target);
      originMap.set(DecoratorManager.getDecoratorClassKey(decoratorNameKey), data);
    }
  }

  attachMetadata(decoratorNameKey, data, target, propertyName) {
    let originMap;
    let key;
    if (propertyName) {
      originMap = DecoratorManager.getOriginMetadata(this.injectMethodKeyPrefix, target, propertyName);
      key = DecoratorManager.getDecoratorMethodKey(decoratorNameKey);
    } else {
      originMap = DecoratorManager.getOriginMetadata(this.injectClassKeyPrefix, target);
      key = DecoratorManager.getDecoratorClassKey(decoratorNameKey);
    }
    if (!originMap.has(key)) {
      originMap.set(key, []);
    }
    originMap.get(key).push(data);
  }

  getMetadata(decoratorNameKey, target, propertyName) {
    if (propertyName) {
      const originMap = DecoratorManager.getOriginMetadata(this.injectMethodKeyPrefix, target, propertyName);
      return originMap.get(DecoratorManager.getDecoratorMethodKey(decoratorNameKey));
    }
    const originMap = DecoratorManager.getOriginMetadata(this.injectClassKeyPrefix, target);
    return originMap.get(DecoratorManager.getDecoratorClassKey(decoratorNameKey));

  }

  savePropertyDataToClass(decoratorNameKey, data, target, propertyName) {
    const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
    originMap.set(DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName), data);
  }

  attachPropertyDataToClass(decoratorNameKey, data, target, propertyName) {
    const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
    const key = DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName);
    if (!originMap.has(key)) {
      originMap.set(key, []);
    }
    originMap.get(key).push(data);
  }

  getPropertyDataFromClass(decoratorNameKey, target, propertyName) {
    const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
    return originMap.get(DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName));
  }

  listPropertyDataFromClass(decoratorNameKey, target) {
    const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
    const res = [];
    for (const [ key, value ] of originMap) {
      if (key.indexOf(DecoratorManager.getDecoratorClsMethodPrefix(decoratorNameKey)) !== -1) {
        res.push(value);
      }
    }
    return res;
  }
}

const manager = new DecoratorManager();


exports.saveClassMetadata = function saveClassMetadata(decoratorNameKey, data, target) {
  return manager.saveMetadata(decoratorNameKey, data, target);
};

exports.attachClassMetadata = function attachClassMetadata(decoratorNameKey, data, target) {
  return manager.attachMetadata(decoratorNameKey, data, target);
};

exports.getClassMetadata = function getClassMetadata(decoratorNameKey, target) {
  return manager.getMetadata(decoratorNameKey, target);
};

exports.saveMethodDataToClass = function saveMethodDataToClass(decoratorNameKey, data, target, method) {
  return manager.savePropertyDataToClass(decoratorNameKey, data, target, method);
};

exports.attachMethodDataToClass = function attachMethodDataToClass(decoratorNameKey, data, target, method) {
  return manager.attachPropertyDataToClass(decoratorNameKey, data, target, method);
};

exports.getMethodDataFromClass = function getMethodDataFromClass(decoratorNameKey, target, method) {
  return manager.getPropertyDataFromClass(decoratorNameKey, target, method);
};


exports.saveModule = function saveModule(decoratorNameKey, target) {
  return manager.saveModule(decoratorNameKey, target);
};

exports.listModule = function listModule(decoratorNameKey) {
  return manager.listModule(decoratorNameKey);
};
