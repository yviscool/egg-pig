'use strict';
const fs = require('fs');
const is = require('is-type-of');
const path = require('path');
const assert = require('assert');
const globby = require('globby');

const debug = require('debug')('egg-core:loader');

const { utils } = require('egg-core');
const EggFileLoader = require('egg-core/lib/loader/file_loader');

const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');
// const EXPORTS = Symbol.for('EGG_LOADER_ITEM_EXPORTS');


class FileLoader extends EggFileLoader {

  // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
  static methodToMiddleware(Controller, key) {
    return function classControllerMiddleware(...args) {

      let controller;
      // no extends
      if (Object.getPrototypeOf(Controller.prototype) === Object.prototype) {
        controller = new Controller();
        controller.ctx = this;
        controller.app = this.app;
        controller.config = this.app.config;
        controller.service = this.service;
      } else {
        controller = new Controller(this);
      }
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [ this ];
      }
      return utils.callFn(controller[key], args, controller);
    };
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
        const exports = loadController(fullpath, { path: fullpath, pathName });

        // ignore exports when it's null or false returned by filter function
        if (exports == null || (filter && filter(exports) === false)) continue;

        // set properties of class
        if (is.class(exports)) {
          exports.prototype.pathName = pathName;
          exports.prototype.fullPath = fullpath;
        }

        items.push({ fullpath, properties, exports });

        debug('parse %s, properties %j, export %j', fullpath, properties, exports);
      }
    }
    return items;
  }


}

// load controller
function loadController(fullpath, opt) {
  let controller;
  const exports = utils.loadFile(fullpath);
  const isClass = module => is.class(module) || is.function(module);
  if (isClass(exports)) {
    controller = exports;
  } else {
    for (const m in exports) {
      const module = exports[m];
      if (isClass(module)) {
        controller = module;
      }
    }
  }
  controller.prototype.pathName = opt.pathName;
  controller.prototype.fullPath = opt.path;
  return wrapClass(controller);
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
        ret[key] = FileLoader.methodToMiddleware(controller, key);
        ret[key][FULLPATH] = controller.prototype.fullPath + '#' + controller.name + '.' + key + '()';
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return ret;

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
