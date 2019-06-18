'use strict';
require('reflect-metadata');
const fs = require('fs');
const is = require('is-type-of');
const assert = require('assert');
const path = require('path');
const globby = require('globby');
const debug = require('debug')('egg-core:loader');

const { BaseContextClass, utils } = require('egg-core');
const EggFileLoader = require('egg-core/lib/loader/file_loader');

const { PATH_METADATA } = require('../constants');
const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');
// const EXPORTS = Symbol.for('EGG_LOADER_ITEM_EXPORTS');


class FileLoader extends EggFileLoader {

  constructor(opt) {
    super(opt);
    this.routers = new Map();
  }

  parse() {

    let files = this.options.match;
    if (!files) {
      files = (process.env.EGG_TYPESCRIPT === 'true' && utils.extensions['.ts'])
        ? [ '**/*.(js|ts)', '!**/*.d.ts' ]
        : [ '**/*.js' ];
    } else {
      files = Array.isArray(files) ? files : [ files ];
    }

    let ignore = this.options.ignore;
    if (ignore) {
      ignore = Array.isArray(ignore) ? ignore : [ ignore ];
      ignore = ignore.filter(f => !!f).map(f => '!' + f);
      files = files.concat(ignore);
    }

    let directories = this.options.directory;
    if (!Array.isArray(directories)) {
      directories = [ directories ];
    }

    const filter = is.function(this.options.filter) ? this.options.filter : null;
    const items = [];
    const isDecorator = controller => Reflect.getMetadata(PATH_METADATA, controller);
    debug('parsing %j', directories);
    for (const directory of directories) {
      const filepaths = globby.sync(files, { cwd: directory });
      for (const filepath of filepaths) {
        const fullpath = path.join(directory, filepath);
        if (!fs.statSync(fullpath).isFile()) continue;
        // get properties
        // app/service/foo/bar.js => [ 'foo', 'bar' ]
        const properties = getProperties(filepath, this.options);
        // app/service/foo/bar.js => service.foo.bar
        const pathName = directory.split(/[/\\]/).slice(-1) + '.' + properties.join('.');
        // get exports from the file
        const { exports, wrapClass } = loadController(fullpath, { path: fullpath, pathName });

        // ignore exports when it's null or false returned by filter function
        if (wrapClass == null || (filter && filter(wrapClass) === false)) continue;

        // set properties of class
        if (is.class(wrapClass)) {
          wrapClass.prototype.pathName = pathName;
          wrapClass.prototype.fullPath = fullpath;
        }

        items.push({ fullpath, properties, exports: wrapClass });

        if (isDecorator(exports)) {
          this.routers.set(fullpath, {
            fullpath,
            properties,
            routerPaths: [],
            routerMetadata: null,
            name: exports.name,
            metatype: exports,
          });
        }

        debug('parse %s, properties %j, export %j', fullpath, properties, exports);
      }
    }
    return items;
  }


  getRouters() {
    return this.routers;
  }


}


// load controller
function loadController(fullpath, opt) {
  const exports = utils.loadFile(fullpath);
  if (is.class(exports)) {
    exports.prototype.pathName = opt.pathName;
    exports.prototype.fullPath = opt.path;
    return {
      exports,
      wrapClass: wrapClass(exports),
    };
  }
  if (
    (is.function(exports) && !is.class(exports))
      || is.generatorFunction(exports)
      || is.asyncFunction(exports)
      || is.object(exports)
  ) {
    throw new Error(`Does not support controlller is a common function or object ${exports.name}`);
  }
  return { exports };
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
      let controller;
      // no extends
      if (Object.getPrototypeOf(Controller.prototype) === Object.prototype) {
        const base = new BaseContextClass(this);
        controller = new Controller();
        controller.ctx = base.ctx;
        controller.app = base.app;
        controller.config = base.config;
        controller.service = base.service;
      } else {
        controller = new Controller(this);
      }
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [ this ];
      }
      // return fn.call(controller, ...args);
      return utils.callFn(controller[key], args, controller);
    };
  }
}


function getProperties(filepath, { caseStyle }) {
  // if caseStyle is function, return the result of function
  if (is.function(caseStyle)) {
    const result = caseStyle(filepath);
    assert(is.array(result), `caseStyle expect an array, but got ${result}`);
    return result;
  }
  // use default camelize
  return defaultCamelize(filepath, caseStyle);
}

function defaultCamelize(filepath, caseStyle) {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }

    // use default camelize, will capitalize the first letter
    // foo_bar.js > FooBar
    // fooBar.js  > FooBar
    // FooBar.js  > FooBar
    // FooBar.js  > FooBar
    // FooBar.js  > fooBar (if lowercaseFirst is true)
    property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    let first = property[0];
    switch (caseStyle) {
      case 'lower':
        first = first.toLowerCase();
        break;
      case 'upper':
        first = first.toUpperCase();
        break;
      case 'camel':
      default:
    }
    return first + property.substring(1);
  });
}

module.exports = FileLoader;
