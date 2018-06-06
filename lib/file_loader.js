'use strict';
const fs = require('fs');
const is = require('is-type-of');
const path = require('path');
const globby = require('globby');
const { EggLoader } = require('egg-core');

const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');
const EXPORTS = Symbol.for('EGG_LOADER_ITEM_EXPORTS');

const utils = require('./utils');
const assert = require('assert');

const validGuards = (guards = []) => {
  assert(Array.isArray(guards), 'global guards should be array');
  return guards.filter(guard =>
    guard && (is.function(guard) || is.function(guard.canActivate))
  );

};
const validPipes = (pipes = []) => {
  assert(Array.isArray(pipes), 'global pipes should be array');
  return pipes.filter(pipe =>
    pipe && (is.function(pipe) || is.function(pipe.transform))
  );
};
const validInterceptors = (interceptors = []) => {
  assert(Array.isArray(interceptors), 'global interceptors should be array');
  return interceptors.filter(interceptor =>
    interceptor && (is.function(interceptor) || is.function(interceptor.intercept))
  );
};
const validFilters = (filters = []) => {
  assert(Array.isArray(filters), 'global filters should be array');
  return filters.filter(filter =>
    filter && (is.function(filter) || is.function(filter.catch))
  );
};

class FileLoader {

  constructor(app) {
    // this.logger = app.logger;
    this.baseDir = app.baseDir;
    this.controllerTarget = app.controller = {};
    this.preventLoadController = app.config.eggpig.preventLoadController;

    this.config = {
      globalGuards: validGuards(app.config.globalGuards),
      globalPipes: validPipes(app.config.globalPipes),
      globalInterceptors: validInterceptors(app.config.globalInterceptors),
      globalFilters: validFilters(app.config.globalFilters),
    };

    this.preventer = {

      logger: app.logger,

      preventDefault() {
        const logger = this.logger;
        EggLoader.prototype.loadController = function() {
          logger.info('[egg-pig] prevent default loadController success.');
        };
      },
    };

    this.items = this.parse();
    this.load();
  }

  // load Controller
  load() {

    const target = this.controllerTarget;

    if (!this.preventLoadController) {
      return;
    }

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
    const items = [];
    for (const filepath of filepaths) {
      const fullpath = path.join(directory, filepath);
      if (!fs.statSync(fullpath).isFile()) continue;

      // foo.ts/js
      const baseName = path.basename(fullpath);
      // foo
      const routerName = baseName.substring(0, baseName.indexOf('.'));
      // routername  middlreconsumer key;

      const properties = getProperties(filepath);
      // app/service/foo/bar.js => service.foo.bar
      const pathName = directory.split(/\/|\\/).slice(-1) + '.' + properties.join('.');
      // get exports from the file

      const [ exports, wrapClass ] = utils.loadController(fullpath, { path: fullpath, pathName });
      // ignore exports when it's null or false returned by filter function
      if (wrapClass == null) continue;

      // set properties of class
      if (is.class(wrapClass)) {
        wrapClass.prototype.pathName = pathName;
        wrapClass.prototype.fullPath = fullpath;
      }
      // routerName is use for modules: Map<string, module>
      // wrapclass is a ret object : { create(){}, delete(){}}
      items.push({ fullpath, properties, wrapClass, exports, routerName });
    }
    return items;
  }

  getConfig() {
    return this.config;
  }

  getRouters() {
    return this.items;
  }
}


module.exports = FileLoader;

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
