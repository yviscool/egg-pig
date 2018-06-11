'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const assert = require('assert');
const { PATH_METADATA } = require('./constants');

class MiddlewaresConsumer {

  static setRouter(router) {
    assert(('post' in router) && is.function(router.post), `must be router, but get ${router}`);
    this.router = router;
    this.init();
    return this;
  }

  static init() {

    this.storges = {

      string: route => ([ this.validateRouterPath(route) ]),

      path: ({ path }) => ([ this.validateRouterPath(path) ]),

      controller: (controller, routePath, isRestful) => (
        [ ...new Set(
          this.scanForPaths(controller, routePath, isRestful)
        ).values() ]
      ),

    };

  }


  static apply(...middlewares) {
    const ms = this.validEach(middlewares);
    this.middlewares = ms;
    return this;
  }

  // routes = ['/xxx', '/yyy ]
  // routes = [ controllerA, controllerB ]
  static forRoutes(...routes) {
    assert(this.middlewares && this.middlewares.length >= 1, 'middlewares not defined');
    routes
      .map(route => this.mapRouteToRouteProps(route))
      .forEach(this.reolveRouter.bind(this));
    return this;
  }


  static mapRouteToRouteProps(route) {

    // 'cats' or '/cats'
    if (is.string(route)) return this.storges.string(route);

    // { path : 'cats'}
    if (route.path && is.string(route.path)) return this.storges.path(route);

    // { controller.foo }
    const { controller, metadata } = this.getMappingController(route);
    const { prefix, isRestful } = metadata || { prefix: '' };


    // controller
    return this.storges.controller(controller, prefix, isRestful);
  }

  static reolveRouter(path) {
    const verb = this.getMethod();
    const route = this.router[verb].bind(this.router);
    route(path, ...this.middlewares);
  }

  static reflectMethodPath(proto, method) {
    return Reflect.getMetadata(PATH_METADATA, proto, method);
  }

  static scanForPaths(controller, routePath, isRestful) {
    const proto = controller.prototype;
    // prefix ='/xxx/' => '/xxx'
    let basePath = routePath[routePath.length - 1] === '/' ? routePath.slice(0, routePath.length - 1) : routePath;
    //  prefix = '/' then tranfrom into ''
    basePath = basePath.length === 1 ? '' : basePath;

    if (!isRestful) {
      return Object
        .getOwnPropertyNames(proto)
        .filter(method => is.function(proto[method]) && method !== 'constructor')
        .map(method => {
          const methodPath = this.reflectMethodPath(proto, method);
          return this.validateRouterPath(basePath + methodPath);
        });
    }
    return [
      basePath,
      basePath + '/:id', // the same as '/new'
      basePath + '/:id/edit',
    ];
  }

  static getMappingController(route) {
    // loadController 阶段会往 controller 设置一个 fullpath 的 symbol;
    const symbols = Object.getOwnPropertySymbols(route);

    assert(symbols && symbols.length, `${route} is not a Controller`);
    // controller
    for (const key of symbols) {
      const fullPath = route[key];
      if (fullPath.indexOf('.') < 0) continue;
      // const baseName = path.basename(fullPath); //  foo.ts/js
      // const routeName = baseName.substring(0, baseName.indexOf('.')); // foo
      const { metatype, routerMetadata } = this.routers.get(fullPath);
      return {
        controller: metatype,
        metadata: routerMetadata,
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

  static validEach(middlewares) {
    return middlewares.map(m => {
      assert(is.function(m), `Middleware ${m} must be function`);
      if (is.asyncFunction(m)) {
        return m;
      }
      if (is.function(m)) {
        return m();
      }
      return async function defaultFnc(ctx, next) {
        await next();
      };
    });
  }

}

MiddlewaresConsumer.routers = require('./consumer').getRouters();

module.exports = MiddlewaresConsumer;
