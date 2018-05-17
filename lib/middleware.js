'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const path = require('path');
const { PATH_METADATA } = require('./constants');

const CLASS = Symbol.for('controller#class');
const METADATA = Symbol.for('controller#metadata');

class MiddlewaresConsumer {

  static setRouter(router) {
    if (!('get' in router)) {
      throw new Error(`should be router, but get ${router}`);
    }
    this.router = router;
    this.init();
    return this;
  }

  static init() {

    this.strategies = {

      string: route => ([ this.validateRouterPath(route) ]),

      path: ({ routePath }) => ([ this.validateRouterPath(routePath) ]),

      controller: (controller, routePath) => (
        [ ...new Set(
          this.scanForPaths(controller, routePath)
        ).values() ]
      ),

      restful: () => { },

    };

  }


  static apply(...middlewares) {
    this.middlewares = middlewares;
    return this;
  }

  // routes = ['/xxx', '/yyy ]
  // routes = [ controllerA, controllerB ]
  static forRoutes(...routes) {
    if (!this.middlewares || this.middlewares.length < 1) {
      throw new Error('middlewares not defined');
    }
    routes
      .map(route => this.mapRouteToRouteProps(route))
      .forEach(this.reolveRouter.bind(this));
    return this;
  }


  static mapRouteToRouteProps(route) {
    // 'cats' or '/cats'
    if (is.string(route)) return this.strategies.string(route);

    const { controller /* metadata*/ } = this.getMappingController(route);
    const { prefix } = this.reflectRoutePath(controller);

    // { path : 'cats'}
    if (!prefix) return this.strategies.path(prefix);

    // // restful
    // if (metadata.isRestful) return this.strategies('restful')(controller, prefix);

    // controller
    return this.strategies.controller(controller, prefix);
  }

  static reolveRouter(path) {
    const verb = this.getMethod();
    const route = this.router[verb].bind(this.router);
    route(path, ...this.middlewares);
  }


  static reflectRoutePath(route) {
    return Reflect.getMetadata(PATH_METADATA, route);
  }

  static reflectMethodPath(proto, method) {
    return Reflect.getMetadata(PATH_METADATA, proto, method);
  }

  static scanForPaths(controller, routePath) {
    const proto = controller.prototype;
    return Object
      .getOwnPropertyNames(proto)
      .filter(method => is.function(proto[method]) && method !== 'constructor')
      .map(method => {
        const methodPath = this.reflectMethodPath(proto, method);
        return this.validateRouterPath(routePath + methodPath);
      });
  }

  static getMappingController(route) {
    // loadController 阶段会往 controller 设置一个 fullpath 的 symbol;
    const symbols = Object.getOwnPropertySymbols(route);

    // controller.method such: controller.cats.create
    if (!symbols.length) {
      return false;
    }
    // controller
    for (const key of symbols) {
      const fullPath = route[key];
      if (fullPath.indexOf('.') < 0) continue;
      const baseName = path.basename(fullPath); //  foo.ts/js
      const routeName = baseName.substring(0, baseName.indexOf('.')); // foo
      const pathProperties = this.modules.get(routeName);
      return {
        controller: pathProperties[CLASS],
        metadata: pathProperties[METADATA],
      };
    }
  }

  static getMethod() {
    return 'all';
  }

  static validateRouterPath(path) {
    const prefix = this.validateMethodPath(path);
    return prefix === '/' ? '' : prefix;
  }

  static validateMethodPath(path) {
    return path.charAt(0) !== '/' ? '/' + path : path;
  }

}

MiddlewaresConsumer.modules = require('./consumer').modules;

module.exports = MiddlewaresConsumer;
