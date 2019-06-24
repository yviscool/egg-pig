'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const uuid = require('uuid/v4');
const {
  RouteParamTypes,
  RequestMethod,
  GUARDS_METADATA,
  INTERCEPTORS_METADATA,
  EXCEPTION_FILTERS_METADATA,
  FILTER_CATCH_EXCEPTIONS,
  HTTP_CODE_METADATA,
  PIPES_METADATA,
  ROUTE_ARGS_METADATA,
  PATH_METADATA,
  METHOD_METADATA,
  ROUTE_NAME_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
  PRIORITY_METADATA,
} = require('./constants');


const Reflector = {
  set(metadataKey, metadataValue, key, value) {
    if (value) {
      Reflect.defineMetadata(metadataKey, metadataValue, key, value);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, key);
    }
  },
  get(metadataKey, key, value) {
    return value
      ? Reflect.getMetadata(metadataKey, key, value)
      : Reflect.getMetadata(metadataKey, key);
  },
};

// function randomString() {
//   return Math.random()
//     .toString(36)
//     .substring(2, 15);
// }

function validatePath(path) {
  return path.charAt(0) !== '/' ? '/' + path : path;
}

function validateRouteName(name) {
  return name.charAt(0) === '/' ? name.substring(1) : name;
}


const validPipe = pipe => pipe && (is.function(pipe) || is.function(pipe.transform));
const validGuard = guard => guard && (is.function(guard) || is.function(guard.canActivate));
const validFilter = filter => filter && (is.function(filter) || is.function(filter.catch));
const validInterceptor = interceptor => interceptor && (is.function(interceptor) || is.function(interceptor.intercept));

/**
 * @param {Array} arr : xxxGuard
 * @param {Function} validataFn  : validGuard, validPipe
 * @param {Function|Object} klass : classMethod or klass
 * @param {String} descriptor : '@UseGuard'
 * @param {String} item  : 'guard'
 */
function validEach(arr, validataFn, klass, descriptor, item) {
  const flags = arr.filter(a => {
    return !validataFn(a);
  });
  if (flags.length > 0) {
    throw new Error(`Invalid ${item} passed to ${descriptor}() decorator ${klass.name}`);
  }
}

function validEachFactory(metadata, arr, classOrClassMethod) {
  if (metadata === GUARDS_METADATA) {
    validEach(arr, validGuard, classOrClassMethod, '@UseGuards', 'guard');
    return;
  }

  if (metadata === PIPES_METADATA) {
    validEach(arr, validPipe, classOrClassMethod, '@UsePipes', 'pipe');
    return;
  }

  if (metadata === INTERCEPTORS_METADATA) {
    validEach(arr, validInterceptor, classOrClassMethod, '@UseInterceptors', 'interceptor');
    return;
  }

  if (metadata === EXCEPTION_FILTERS_METADATA) {
    validEach(arr, validFilter, classOrClassMethod, '@UseFilters', 'filter');
    return;
  }
}

function createParamMapping(paramType, factory) {
  return (data, ...pipes) => {
    return (target, key, index) => {
      const isFile = paramType === RouteParamTypes.FILE
        || paramType === RouteParamTypes.FILES
        || paramType === RouteParamTypes.FILESTREAM
        || paramType === RouteParamTypes.FILESSTREAM;
      const hasParamData = is.nullOrUndefined(data) || is.string(data);
      const paramData = (hasParamData || isFile) ? data : undefined;
      const paramPipe = (hasParamData || isFile) ? pipes : [ data, ...pipes ];
      const args = Reflector.get(ROUTE_ARGS_METADATA, target, key);
      Reflector.set(ROUTE_ARGS_METADATA, {
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
  return (name, path) => {
    return (target, key, descriptor) => {

      // get('/user')
      if (name && !path) {
        Reflector.set(PATH_METADATA, validatePath(name), target, key);
      }
      // get()
      if (!name) {
        Reflector.set(PATH_METADATA, '/', target, key);
      }
      // get('user','/user')
      if (name && path) {
        Reflector.set(ROUTE_NAME_METADATA, name, target, key);
        Reflector.set(PATH_METADATA, validatePath(path), target, key);
      }
      Reflector.set(METHOD_METADATA, methodType, target, key);

      return descriptor;
    };
  };
}


function createUseMapping(metadata) {
  return (...arr) => (target, key, descriptor) => {
    if (descriptor) {
      validEachFactory(metadata, arr, descriptor.value);
      Reflector.set(metadata, arr, target, key);
      return descriptor;
    }
    validEachFactory(metadata, arr, target);
    Reflector.set(metadata, arr, target);
    return target;
  };
}

// filter catch
exports.Catch = function Catch(...exceptions) {
  return target => {
    Reflector.set(FILTER_CATCH_EXCEPTIONS, exceptions, target);
  };
};

// controller
exports.Controller = function Controller(prefix = '/') {
  return target => {
    Reflector.set(PATH_METADATA, { prefix: validatePath(prefix) }, target);
  };
};

// router priority
exports.Priority = function Priority(priority = 0) {
  return target => {
    Reflector.set(PRIORITY_METADATA, priority, target);
  };
};

// resources
exports.Resources = function Resources(name, prefix) {
  return target => {
    Reflector.set(PATH_METADATA, {
      name: validateRouteName(name),
      prefix: validatePath(prefix ? prefix : name),
      isRestful: true,
    }, target);
    return target;
  };
};

// httpcode

exports.HttpCode = function HttpCode(statusCode) {
  return (target, key) => {
    Reflector.set(HTTP_CODE_METADATA, statusCode, target, key);
  };
};

exports.Render = function Render(template) {
  return (target, key) => {
    Reflector.set(RENDER_METADATA, template, target, key);
  };
};

exports.Header = function Header(name, value) {
  return (target, key) => {
    const metadata = Reflector.get(HEADER_METADATA, target, key) || [];
    Reflector.set(HEADER_METADATA, [ ...metadata, ...[{ name, value }] ], target, key);
  };
};

exports.createParamDecorator = function createParamDecorator(factory) {
  const paramtype = uuid();
  return createParamMapping(paramtype, factory);
};

exports.ReflectMetadata = function ReflectMetadata(metadataKey, metadataValue) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflector.set(metadataKey, metadataValue, descriptor.value);
      return descriptor;
    }
    Reflector.set(metadataKey, metadataValue, target);
    return target;
  };
};

// paramtypes
exports.Body = createParamMapping(RouteParamTypes.BODY);
exports.Param = createParamMapping(RouteParamTypes.PARAM);
exports.Query = createParamMapping(RouteParamTypes.QUERY);
exports.Context = createParamMapping(RouteParamTypes.CONTEXT);
exports.Session = createParamMapping(RouteParamTypes.SESSION);
exports.Headers = createParamMapping(RouteParamTypes.HEADERS);
exports.Request = createParamMapping(RouteParamTypes.REQUEST);
exports.Response = createParamMapping(RouteParamTypes.RESPONSE);
exports.UploadedFile = createParamMapping(RouteParamTypes.FILE);
exports.UploadedFiles = createParamMapping(RouteParamTypes.FILES);
exports.UploadedFileStream = createParamMapping(RouteParamTypes.FILESTREAM);
exports.UploadedFilesStream = createParamMapping(RouteParamTypes.FILESSTREAM);

// http verb
exports.Get = createRouterMapping(RequestMethod.GET);
exports.All = createRouterMapping(RequestMethod.ALL);
exports.Put = createRouterMapping(RequestMethod.PUT);
exports.Post = createRouterMapping(RequestMethod.POST);
exports.Head = createRouterMapping(RequestMethod.HEAD);
exports.Patch = createRouterMapping(RequestMethod.PATCH);
exports.Delete = createRouterMapping(RequestMethod.DELETE);
exports.Options = createRouterMapping(RequestMethod.OPTIONS);

// alias
exports.Req = exports.Request;
exports.Res = exports.Response;
exports.Ctx = exports.Context;
exports.Restful = exports.Resources;


exports.UsePipes = createUseMapping(PIPES_METADATA);
exports.UseGuards = createUseMapping(GUARDS_METADATA);
exports.UseFilters = createUseMapping(EXCEPTION_FILTERS_METADATA);
exports.UseInterceptors = createUseMapping(INTERCEPTORS_METADATA);

// pipe/guard/interceptor/filters
exports.Injectable = () => () => { };
