'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const path = require('path');
const { PATH_METADATA } = require('./constants');
const CLASS = Symbol.for('controller#class');

class MiddlewaresConsumer {

  static setRouter(router) {
    this.router = router;
    return this;
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
    // 'cats' or 'cats'
    if (is.string(route)) {
      return [ this.validateRouterPath(route) ];
    }

    const controller = this.getMappingController(route);
    const { prefix: routePath } = this.reflectRoutePath(controller);
    // { path : 'cats'}
    if (!routePath) {
      const { path } = routePath;
      return [ this.validateRouterPath(path) ];
    }
    // controller
    const uniquePathsSet = new Set(
      this.scanForPaths(controller, routePath)
    );
    return [ ...uniquePathsSet.values() ];
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
    for (const key of Object.getOwnPropertySymbols(route)) {
      const fullPath = route[key];
      if (fullPath.indexOf('.') < 0) continue;
      const baseName = path.basename(fullPath); //  foo.ts/js
      const routeName = baseName.substring(0, baseName.indexOf('.')); // foo
      const pathProperties = this.modules.get(routeName);
      return pathProperties[CLASS];
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
