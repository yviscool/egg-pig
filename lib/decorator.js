'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const {
  RouteParamTypes,
  RequestMethod,
  GUARDS_METADATA,
  INTERCEPTORS_METADATA,
  PIPES_METADATA,
  ROUTE_ARGS_METADATA,
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_NAME_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
} = require('./constants');


function randomString() {
  return Math.random()
    .toString(36)
    .substring(2, 15);
}

function validatePath(path) {
  return path.charAt(0) !== '/' ? '/' + path : path;
}

function validateRouteName(name) {
  return name.charAt(0) === '/' ? name.substring(1) : name;
}

function createMapping(paramType, factory) {
  return function(data, ...pipes) {
    return (target, key, index) => {
      const paramData = is.function(data) ? undefined : data;
      const paramPipe = is.function(data) ? [ data, ...pipes ] : pipes;
      const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key);
      Reflect.defineMetadata(ROUTE_ARGS_METADATA, {
        ...args,
        [`${paramType}:${index}`]: {
          index,
          factory,
          data: paramData,
          pipes: paramPipe,
        },
      }, target, key);
    };
  };
}

function createRouterMapping(methodType = RequestMethod.GET) {
  return function(name, path) {
    return (target, key, descriptor) => {

      // get('/user')
      if (name && !path) {
        Reflect.defineMetadata(PATH_METADATA, validatePath(name), target, key);
      }
      // get()
      if (!name) {
        Reflect.defineMetadata(PATH_METADATA, '/', target, key);
      }
      // get('user','/user')
      if (name && path) {
        Reflect.defineMetadata(ROUTE_NAME_METADATA, name, target, key);
        Reflect.defineMetadata(PATH_METADATA, validatePath(path), target, key);
      }
      Reflect.defineMetadata(METHOD_METADATA, methodType, target, key);

      return descriptor;
    };
  };
}

exports.UseGuards = function UseGuards(...guards) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(GUARDS_METADATA, guards, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(GUARDS_METADATA, guards, target);
    return target;
  };
};

exports.UsePipes = function UsePipes(...pipes) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(PIPES_METADATA, pipes, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(PIPES_METADATA, pipes, target);
    return target;
  };
};

exports.UseInterceptors = function UseInterceptors(...interceptors) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target);
    return target;
  };
};


// pipe/guard/interceptor
exports.Guard = function Guard() { return function() { }; };
exports.Pipe = function Pipe() { return function() { }; };
exports.Interceptor = function Interceptor() { return function() { }; };


// controller
exports.Controller = function Controller(prefix = '/') {
  return function(target) {
    Reflect.defineMetadata(PATH_METADATA, { prefix: validatePath(prefix) }, target);
  };
};

// resources
exports.Resources = function Resources(name, prefix) {
  return function(target) {
    Reflect.defineMetadata(PATH_METADATA, {
      name: validateRouteName(name),
      prefix: validatePath(prefix ? prefix : name),
      isRestful: true,
    }, target);
    return target;
  };
};

exports.Render = function Render(template) {
  return function(target, key) {
    Reflect.defineMetadata(RENDER_METADATA, template, target, key);
  };
};

exports.Header = function Header(name, value) {
  return function(target, key) {
    const metadata = Reflect.getMetadata(HEADER_METADATA, target, key) || [];
    Reflect.defineMetadata(HEADER_METADATA, [ ...metadata, ...[{ name, value }] ], target, key);
  };
};

exports.createParamDecorator = function createParamDecorator(factory) {
  return createMapping(randomString() + randomString(), factory);
};


// paramtypes
exports.Body = createMapping(RouteParamTypes.BODY);
exports.Param = createMapping(RouteParamTypes.PARAM);
exports.Query = createMapping(RouteParamTypes.QUERY);
exports.Context = createMapping(RouteParamTypes.CONTEXT);
exports.Request = createMapping(RouteParamTypes.REQUEST);
exports.Response = createMapping(RouteParamTypes.RESPONSE);
exports.Session = createMapping(RouteParamTypes.SESSION);
exports.Headers = createMapping(RouteParamTypes.HEADERS);
exports.UploadedFile = createMapping(RouteParamTypes.FILE);
exports.UploadedFiles = createMapping(RouteParamTypes.FILES);

// http verb
exports.Head = createRouterMapping(RequestMethod.HEAD);
exports.Get = createRouterMapping(RequestMethod.GET);
exports.All = createRouterMapping(RequestMethod.ALL);
exports.Post = createRouterMapping(RequestMethod.POST);
exports.Delete = createRouterMapping(RequestMethod.DELETE);
exports.Options = createRouterMapping(RequestMethod.OPTIONS);
exports.Put = createRouterMapping(RequestMethod.PUT);
exports.Patch = createRouterMapping(RequestMethod.PATCH);

// alias
exports.Req = exports.Request;
exports.Res = exports.Response;
exports.Ctx = exports.Context;
exports.Restful = exports.Resources;

