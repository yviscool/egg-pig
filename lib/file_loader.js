'use strict';
require('reflect-metadata');
const fs = require('fs');
const is = require('is-type-of');
const path = require('path');
const globby = require('globby');
const assert = require('assert');

const { EggLoader, utils } = require('egg-core');

const { PATH_METADATA } = require('./constants');
const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');
const EXPORTS = Symbol.for('EGG_LOADER_ITEM_EXPORTS');


const Validator = {

  start(config) {
    return {
      globalGuards: this.validGuards(config.globalGuards),
      globalPipes: this.validPipes(config.globalPipes),
      globalInterceptors: this.validInterceptors(config.globalInterceptors),
      globalFilters: this.validFilters(config.globalFilters),
    };
  },

  validGuards(guards = []) {
    assert(Array.isArray(guards), 'global guards should be array');
    return guards.filter(guard =>
      guard && (is.function(guard) || is.function(guard.canActivate))
    );
  },

  validPipes(pipes = []) {
    assert(Array.isArray(pipes), 'global pipes should be array');
    return pipes.filter(pipe =>
      pipe && (is.function(pipe) || is.function(pipe.transform))
    );
  },

  validInterceptors(interceptors = []) {
    assert(Array.isArray(interceptors), 'global interceptors should be array');
    return interceptors.filter(interceptor =>
      interceptor && (is.function(interceptor) || is.function(interceptor.intercept))
    );
  },

  validFilters(filters = []) {
    assert(Array.isArray(filters), 'global filters should be array');
    return filters.filter(filter =>
      filter && (is.function(filter) || is.function(filter.catch))
    );
  },

};

class FileLoader {

  constructor(app) {

    this.baseDir = app.baseDir;
    this.controllerTarget = app.controller = {};
    this.preventLoadController = app.config.eggpig.preventLoadController;

    this.config = Validator.start(app.config);

    this.preventer = {

      logger: app.logger,

      preventDefault() {
        const logger = this.logger;
        EggLoader.prototype.loadController = function() {
          logger.info('[egg-pig] prevent default loadController success.');
        };
      },
    };

    this.items = [];
    this.routers = [];
    this.parse();
    this.load();
  }

  // load Controller
  load() {

    const target = this.controllerTarget;

    if (!this.preventLoadController) return;

    for (const item of this.items) {
      item.properties.reduce((target, property, index) => {
        let obj;
        if (index === item.properties.length - 1) {
          obj = item.wrapClass;
          if (obj && !is.primitive(obj)) {
            obj[FULLPATH] = item.fullpath;
            obj[EXPORTS] = true;
          }
        } else {
          obj = target[property] || {};
        }
        target[property] = obj;
        return obj;
      }, target);
    }


    // prevent load default controller/service
    this.preventer.preventDefault();
  }

  parse() {
    const files =
      (process.env.EGG_TYPESCRIPT === 'true' && require.extensions['.ts'])
        ? [ '**/*.(js|ts)', '!**/*.d.ts' ]
        : [ '**/*.js' ];
    const directory = path.join(this.baseDir, 'app/controller');
    const filepaths = globby.sync(files, { cwd: directory });
    const items = this.items;
    const routers = this.routers;
    const isDecorator = controller => Reflect.getMetadata(PATH_METADATA, controller);

    for (const filepath of filepaths) {
      const fullpath = path.join(directory, filepath);
      if (!fs.statSync(fullpath).isFile()) continue;
      // app/service/foo/bar.js => [ 'foo', 'bar' ]
      const properties = getProperties(filepath);
      // app/service/foo/bar.js => service.foo.bar
      const pathName = directory.split(/\/|\\/).slice(-1) + '.' + properties.join('.');
      // get exports from the file

      const [ controller, wrapClass ] = loadController(fullpath, { path: fullpath, pathName });
      // ignore exports when it's null or false returned by filter function
      if (wrapClass == null) continue;

      // set properties of class
      if (is.class(wrapClass)) {
        wrapClass.prototype.pathName = pathName;
        wrapClass.prototype.fullPath = fullpath;
      }
      // routerName is use for modules: Map<string, module>
      // wrapclass is a ret object : { create(){}, delete(){}}
      items.push({ fullpath, properties, wrapClass });

      // only decorator router will be allowed
      if (isDecorator(controller)) {
        routers.push({ controller, fullpath, properties });
      }
    }
  }

  getConfig() {
    return this.config;
  }

  getRouters() {
    const routersMap = new Map();
    this.routers.forEach(router => {
      const { controller, fullpath, properties } = router;
      routersMap.set(fullpath, {
        fullpath,
        properties,
        routerPaths: [],
        routerMetadata: null,
        name: controller.name,
        metatype: controller,
      });
    });
    return routersMap;
  }
}


module.exports = FileLoader;

// load controller
function loadController(fullpath, opt) {
  const exports = utils.loadFile(fullpath);
  if (is.class(exports)) {
    exports.prototype.pathName = opt.pathName;
    exports.prototype.fullPath = opt.path;
    return [ exports, wrapClass(exports) ];
  }
  if (
    (is.function(exports) && !is.class(exports))
    || is.generatorFunction(exports)
    || is.asyncFunction(exports)
    || is.object(exports)
  ) {
    throw new Error(`Does not support controlller is a common function or object ${exports.name}`);
  }
  return [ exports ];
}

function wrapClass(controller) {
  let proto = controller.prototype;
  const ret = {};
  // tracing the prototype chain
  while (proto !== Object.prototype) {
    const keys = Object.getOwnPropertyNames(proto);
    for (const key of keys) {
      // getOwnPropertyNames will return constructor
      // that should be ignored
      if (key === 'constructor') {
        continue;
      }
      // skip getter, setter & non-function properties
      const d = Object.getOwnPropertyDescriptor(proto, key);
      // prevent to override sub method
      if (is.function(d.value) && !ret.hasOwnProperty(key)) {
        ret[key] = methodToMiddleware(controller, key);
        ret[key][FULLPATH] = controller.prototype.fullPath + '#' + controller.name + '.' + key + '()';
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return ret;

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  function methodToMiddleware(Controller, key) {
    return function classControllerMiddleware(...args) {
      const controller = new Controller(this);
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [ this ];
      }
      // return fn.call(controller, ...args);
      return utils.callFn(controller[key], args, controller);
    };
  }
}


function getProperties(filepath) {
  // use default camelize
  return defaultCamelize(filepath);
}

function defaultCamelize(filepath) {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }
    property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    const first = property[0];
    return first + property.substring(1);
  });
}
