'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const assert = require('assert');
const { ROUTE_OPTIONS_METADATA, REST_MAP, RequestMethod } = require('./constants');

class MiddlewaresConsumer {

  static setRouter(router) {
    assert(('post' in router) && is.function(router.post), `must be router, but get ${router}`);
    this.router = router;
    return this;
  }


  static init(globalPrefix) {

    this.storges = {

      string: path => [ this.validateRouterPath(path), RequestMethod.ALL ],

      path: ({ path, method = RequestMethod.ALL }) => [ this.validateRouterPath(path), method ],

      controller: controllerInfo => this.scanForPaths(controllerInfo),

    };

    this.globalPrefix = globalPrefix;

    this.excludedRoutes = [];
  }


  static apply(...middlewares) {
    const ms = this.validEach(middlewares);
    this.middlewares = ms;
    return this;
  }

  // routes = ['/xxx', '/yyy', [path:'zjl',method:RequestMethod.GET] ,controller.XXX ]
  static forRoutes(...routes) {
    assert(this.middlewares && this.middlewares.length >= 1, 'middlewares not defined');
    routes
      .map(this.mapRouteToRouteProps.bind(this))
      .reduce(this.flatRoute.bind(this), [])
      .filter(route => !this.isRouteExcluded(route))
      .forEach(this.resolveRouter.bind(this));

    return this;
  }


  static exclude(...routes) {
    assert(this.middlewares && this.middlewares.length >= 1, 'middlewares not defined');
    this.excludedRoutes = routes.map(this.mapRouteToRouteProps.bind(this));
    return this;
  }


  static mapRouteToRouteProps(route) {
    // 'cats' or '/cats'
    if (is.string(route)) return this.storges.string(route);

    // { path : 'cats', method: RequestMethod.GET}
    // { path : 'cats' } method will be RequestMethod.ALL
    if (route.path) return this.storges.path(route);

    // { controller.xxx }
    const { controller, metadata } = this.getMappingController(route);
    const { prefix } = metadata || { prefix: '' };

    // controller
    return this.storges.controller({ controller, prefix });
  }

  static resolveRouter([ path, method ]) {
    const globalPrefix = this.globalPrefix ? this.globalPrefix : '';
    const routerMethod = this.getRouterMethod(method);
    routerMethod(globalPrefix + path, ...this.middlewares);
  }

  static reflectMethodPath(proto, method) {
    return Reflect.getMetadata(ROUTE_OPTIONS_METADATA, proto, method) || {};
  }

  static scanForPaths({ controller, prefix }) {
    const proto = controller.prototype;
    // prefix ='/xxx/' => '/xxx'
    let basePath = prefix.replace(/\/$/, '');
    //  prefix = '/' then tranfrom into ''
    basePath = basePath.length === 1 ? '' : basePath;

    return Object
      .getOwnPropertyNames(proto)
      .filter(method => is.function(proto[method]) && method !== 'constructor')
      .filter(method => this.reflectMethodPath(controller, method) || Object.keys(REST_MAP).some(key => proto[key]))
      .reduce((routerPathAndMethod, method) => {
        const { path: methodPath, requestMethod } = this.reflectMethodPath(controller, method);
        const opts = REST_MAP[method];
        if (methodPath) {
          routerPathAndMethod.push([ this.validateRouterPath(basePath + methodPath), requestMethod ]);
          return routerPathAndMethod;
        }
        const path = opts.suffix ? `${basePath}/${opts.suffix}` : basePath;
        // opts.method = [PATCH,PUT]
        if (Array.isArray(opts.method)) {
          routerPathAndMethod.push([ path, RequestMethod[`${opts.method[0]}`] ]);
          routerPathAndMethod.push([ path, RequestMethod[`${opts.method[1]}`] ]);
          return routerPathAndMethod;
        }
        routerPathAndMethod.push([ path, RequestMethod[`${opts.method}`] ]);
        return routerPathAndMethod;
      }, []);
  }

  static getMappingController(route) {
    // loadController 阶段会往 controller 设置一个 fullpath 的 symbol;
    const symbols = Object.getOwnPropertySymbols(route);

    assert(symbols && symbols.length, `${route} is not a Controller`);
    // controller
    for (const key of symbols) {
      const fullPath = route[key];
      if (fullPath.indexOf('.') < 0) continue;
      const { metatype, routerMetadata } = this.routers.get(fullPath);
      return {
        controller: metatype,
        metadata: routerMetadata,
      };
    }
  }

  static getRouterMethod(method) {
    const methodName /* get, post..*/ = RequestMethod[method];
    return this.router[methodName].bind(this.router);
  }

  static isRouteExcluded(route) {

    const [ path, method ] = route;
    // '/foo/' => '/foo'
    const validatedRoutePath = path.replace(/\/$/, '');
    return this.excludedRoutes.some(([ excludedPath, excludedMethod ]) => {
      const isPathEqual = validatedRoutePath === excludedPath;
      if (!isPathEqual) {
        return false;
      }
      return method === excludedMethod || method === RequestMethod.ALL;
    });
  }

  static flatRoute(a, b) {
    if (Array.isArray(b[0])) return a.concat(b);
    a.push(b);
    return a;
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


module.exports = MiddlewaresConsumer;
