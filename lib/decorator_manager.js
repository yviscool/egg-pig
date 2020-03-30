'use strict';
require('reflect-metadata');

class DecoratorManager extends Map {

    /**
     * the key for meta data store in class
     */
    injectClassKeyPrefix = 'INJECTION_CLASS_META_DATA';
    /**
     * the key for method meta data store in class
     */
    injectClassMethodKeyPrefix = 'INJECTION_CLASS_METHOD_META_DATA';

    /**
     * the key for method meta data store in method
     */
    injectMethodKeyPrefix = 'INJECTION_METHOD_META_DATA';

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
        } else {
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
    }

    /**
     * save meta data to class or property
     * @param decoratorNameKey the alias name for decorator
     * @param data the data you want to store
     * @param target target class
     * @param propertyName
     */
    saveMetadata(decoratorNameKey, data, target, propertyName) {
        if (propertyName) {
            const originMap = DecoratorManager.getOriginMetadata(this.injectMethodKeyPrefix, target, propertyName);
            originMap.set(DecoratorManager.getDecoratorMethodKey(decoratorNameKey), data);
        } else {
            const originMap = DecoratorManager.getOriginMetadata(this.injectClassKeyPrefix, target);
            originMap.set(DecoratorManager.getDecoratorClassKey(decoratorNameKey), data);
        }
    }

    /**
     * attach data to class or property
     * @param decoratorNameKey
     * @param data
     * @param target
     * @param propertyName
     */
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

    /**
     * get single data from class or property
     * @param decoratorNameKey
     * @param target
     * @param propertyName
     */
    getMetadata(decoratorNameKey, target, propertyName) {
        if (propertyName) {
            const originMap = DecoratorManager.getOriginMetadata(this.injectMethodKeyPrefix, target, propertyName);
            return originMap.get(DecoratorManager.getDecoratorMethodKey(decoratorNameKey));
        } else {
            const originMap = DecoratorManager.getOriginMetadata(this.injectClassKeyPrefix, target);
            return originMap.get(DecoratorManager.getDecoratorClassKey(decoratorNameKey));
        }
    }

    /**
     * save property data to class
     * @param decoratorNameKey
     * @param data
     * @param target
     * @param propertyName
     */
    savePropertyDataToClass(decoratorNameKey, data, target, propertyName) {
        const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
        originMap.set(DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName), data);
    }

    /**
     * attach property data to class
     * @param decoratorNameKey
     * @param data
     * @param target
     * @param propertyName
     */
    attachPropertyDataToClass(decoratorNameKey, data, target, propertyName) {
        const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
        const key = DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName);
        if (!originMap.has(key)) {
            originMap.set(key, []);
        }
        originMap.get(key).push(data);
    }

    /**
     * get property data from class
     * @param decoratorNameKey
     * @param target
     * @param propertyName
     */
    getPropertyDataFromClass(decoratorNameKey, target, propertyName) {
        const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
        return originMap.get(DecoratorManager.getDecoratorClsMethodKey(decoratorNameKey, propertyName));
    }

    /**
     * list property data from class
     * @param decoratorNameKey
     * @param target
     */
    listPropertyDataFromClass(decoratorNameKey, target) {
        const originMap = DecoratorManager.getOriginMetadata(this.injectClassMethodKeyPrefix, target);
        const res = [];
        for (const [key, value] of originMap) {
            if (key.indexOf(DecoratorManager.getDecoratorClsMethodPrefix(decoratorNameKey)) !== -1) {
                res.push(value);
            }
        }
        return res;
    }
}

const manager = new DecoratorManager();



/**
* save data to class
* @param decoratorNameKey
* @param data
* @param target
*/
exports.saveClassMetadata = function saveClassMetadata(decoratorNameKey, data, target) {
    return manager.saveMetadata(decoratorNameKey, data, target);
}

/**
 * attach data to class
 * @param decoratorNameKey
 * @param data
 * @param target
 */
exports.attachClassMetadata = function attachClassMetadata(decoratorNameKey, data, target) {
    return manager.attachMetadata(decoratorNameKey, data, target);
}

/**
 * get data from class
 * @param decoratorNameKey
 * @param target
 */
exports.getClassMetadata = function getClassMetadata(decoratorNameKey, target) {
    return manager.getMetadata(decoratorNameKey, target);
}

/**
 * save method data to class
 * @deprecated
 * @param decoratorNameKey
 * @param data
 * @param target
 * @param method
 */
exports.saveMethodDataToClass = function saveMethodDataToClass(decoratorNameKey, data, target, method) {
    return manager.savePropertyDataToClass(decoratorNameKey, data, target, method);
}

/**
 * attach method data to class
 * @deprecated
 * @param decoratorNameKey
 * @param data
 * @param target
 * @param method
 */
exports.attachMethodDataToClass = function attachMethodDataToClass(decoratorNameKey, data, target, method) {
    return manager.attachPropertyDataToClass(decoratorNameKey, data, target, method);
}

/**
 * get method data from class
 * @deprecated
 * @param decoratorNameKey
 * @param target
 * @param method
 */
exports.getMethodDataFromClass = function getMethodDataFromClass(decoratorNameKey, target, method) {
    return manager.getPropertyDataFromClass(decoratorNameKey, target, method);
}


/**
 * save module to inner map
 * @param decoratorNameKey
 * @param target
 */
exports.saveModule = function saveModule(decoratorNameKey, target) {
    return manager.saveModule(decoratorNameKey, target);
}

/**
 * list module from decorator key
 * @param decoratorNameKey
 */
exports.listModule = function listModule(decoratorNameKey) {
    return manager.listModule(decoratorNameKey);
}
