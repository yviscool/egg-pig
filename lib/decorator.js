'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const DecoratorManager = require('./decorator_manager');
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
  ROUTE_OPTIONS_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
  PRIORITY_METADATA,
  CONTROLLER_MODULE_METADATA,
} = require('./constants');


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
      // const metatype = target.constructor;
      const isFile = paramType === RouteParamTypes.FILE
        || paramType === RouteParamTypes.FILES
        || paramType === RouteParamTypes.FILESTREAM
        || paramType === RouteParamTypes.FILESSTREAM;
      const hasParamData = is.nullOrUndefined(data) || is.string(data);
      const paramData = (hasParamData || isFile) ? data : undefined;
      const paramPipe = (hasParamData || isFile) ? pipes : [ data, ...pipes ];
      // const args = Reflector.get(ROUTE_ARGS_METADATA, metatype, key);
      // Reflector.set(ROUTE_ARGS_METADATA, {
      //   ...args,
      //   [`${paramType}:${index}`]: {
      //     index,
      //     factory,
      //     data: paramData,
      //     pipes: paramPipe,
      //   },
      // }, metatype, key);
      const args = DecoratorManager.getMethodDataFromClass(ROUTE_ARGS_METADATA, target, key) || {};
      DecoratorManager.saveMethodDataToClass(ROUTE_ARGS_METADATA, {
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

//
function createRouterMapping(methodType = RequestMethod.GET) {
  return (name, paramOptions) => {
    return (target, key, descriptor) => {
      // const metatype = target.constructor;
      const options = {};

      // get('/user')
      if (name && !paramOptions) {
        options.path = validatePath(name);
      }
      // get()
      if (!name) {
        options.path = '/';
      }
      // get('/user', {routerName:'', middlewaer:[]})
      if (name && paramOptions) {
        options.path = validatePath(name);
        options.paramOptions = paramOptions;
      }

      options.requestMethod = methodType;
      options.method = key;
      options.targetCallback = target[key];

      // Reflector.set(ROUTE_OPTIONS_METADATA, options, metatype, key);
      DecoratorManager.attachClassMetadata(ROUTE_OPTIONS_METADATA, options, target);

      return descriptor;
    };
  };
}


function createUseMapping(metadata) {
  return (...arr) => (target, key, descriptor) => {
    if (descriptor) {
      validEachFactory(metadata, arr, descriptor.value);
      // Reflector.set(metadata, arr, target.constructor, key);
      DecoratorManager.saveMethodDataToClass(metadata, arr, target, key);
      return descriptor;
    }
    validEachFactory(metadata, arr, target);
    // Reflector.set(metadata, arr, target);
    DecoratorManager.saveClassMetadata(metadata, arr, target);
    return target;
  };
}

// filter catch
exports.Catch = function Catch(...exceptions) {
  return target => {
    // Reflector.set(FILTER_CATCH_EXCEPTIONS, exceptions, target);
    DecoratorManager.saveClassMetadata(FILTER_CATCH_EXCEPTIONS, exceptions, target);
  };
};

// controller
//  routerOptions = {
//   sensitive: boolean;
//   middleware: KoaMiddlewareParamArray;
//  }
exports.Controller = function Controller(prefix = '/', routerOptions = { middleware: [], sensitive: true }) {
  return target => {
    DecoratorManager.saveModule(CONTROLLER_MODULE_METADATA, target);
    DecoratorManager.saveClassMetadata(PATH_METADATA, {
      name: '',
      prefix: validatePath(prefix),
      isRestful: false,
      routerOptions,
    }, target);
  };
};

// router priority
exports.Priority = function Priority(priority = 0) {
  return target => {
    DecoratorManager.saveClassMetadata(PRIORITY_METADATA, priority, target);
  };
};

// resources
exports.Resources = function Resources(prefix, routerOptions = { middleware: [], sensitive: true }) {
  return target => {
    DecoratorManager.saveModule(CONTROLLER_MODULE_METADATA, target);
    DecoratorManager.saveClassMetadata(PATH_METADATA, {
      name: validateRouteName(routerOptions.name || prefix),
      prefix: validatePath(prefix),
      isRestful: true,
      routerOptions,
    }, target);
    return target;
  };
};

// httpcode

exports.HttpCode = function HttpCode(statusCode) {
  return (target, key) => {
    DecoratorManager.saveMethodDataToClass(HTTP_CODE_METADATA, statusCode, target, key);
  };
};

exports.Render = function Render(template) {
  return (target, key) => {
    DecoratorManager.saveMethodDataToClass(RENDER_METADATA, template, target, key);
  };
};

exports.Header = function Header(name, value) {
  return (target, key) => {
    DecoratorManager.attachMethodDataToClass(HEADER_METADATA, { name, value }, target, key);
  };
};

exports.createParamDecorator = function createParamDecorator(factory) {
  const paramtype = uuid();
  return createParamMapping(paramtype, factory);
};

exports.ReflectMetadata = function ReflectMetadata(metadataKey, metadataValue) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(metadataKey, metadataValue, target);
    return target;
  };
};

// paramtypes
exports.Body = createParamMapping(RouteParamTypes.BODY);
exports.Param = createParamMapping(RouteParamTypes.PARAM);
exports.Query = createParamMapping(RouteParamTypes.QUERY);
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
exports.Restful = exports.Resources;


exports.UsePipes = createUseMapping(PIPES_METADATA);
exports.UseGuards = createUseMapping(GUARDS_METADATA);
exports.UseFilters = createUseMapping(EXCEPTION_FILTERS_METADATA);
exports.UseInterceptors = createUseMapping(INTERCEPTORS_METADATA);

// pipe/guard/interceptor/filters
exports.Injectable = () => () => { };
