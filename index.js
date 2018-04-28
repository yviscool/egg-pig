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
} = require('./lib/constants');

function createMapping(paramType) {
  return function(data, ...pipes) {
    return (target, key, index) => {
      const paramData = is.function(data) ? undefined : data;
      const paramPipe = is.function(data) ? [ data, ...pipes ] : pipes;
      const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key);
      Reflect.defineMetadata(ROUTE_ARGS_METADATA, {
        ...args,
        [`${paramType}:${index}`]: {
          index,
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
        Reflect.defineMetadata(PATH_METADATA, name, target, key);
      }
      // get()
      if (!name) {
        Reflect.defineMetadata(PATH_METADATA, '/', target, key);
      }
      // get('user','/user')
      if (name && path) {
        Reflect.defineMetadata(ROUTE_NAME_METADATA, name, target, key);
        Reflect.defineMetadata(PATH_METADATA, path, target, key);
      }
      Reflect.defineMetadata(METHOD_METADATA, methodType, target, key);

      return descriptor;
    };
  };
}

function UseGuards(...guards) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(GUARDS_METADATA, guards, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(GUARDS_METADATA, guards, target);
    return target;
  };
}

function UsePipes(...pipes) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(PIPES_METADATA, pipes, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(GUARDS_METADATA, pipes, target);
    return target;
  };
}

function UseInterceptors(...interceptors) {
  return (target, key, descriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target, key);
      return descriptor;
    }
    Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target);
    return target;
  };
}


// paramtypes
const Body = createMapping(RouteParamTypes.BODY);
const Param = createMapping(RouteParamTypes.PARAM);
const Query = createMapping(RouteParamTypes.QUERY);
const Context = createMapping(RouteParamTypes.CONTEXT);
const Request = createMapping(RouteParamTypes.REQUEST);
const Response = createMapping(RouteParamTypes.RESPONSE);
const Session = createMapping(RouteParamTypes.SESSION);
const Headers = createMapping(RouteParamTypes.HEADERS);
const UploadedFile = createMapping(RouteParamTypes.FILE);
const UploadedFiles = createMapping(RouteParamTypes.FILES);

// http verb
const Head = createRouterMapping(RequestMethod.HEAD);
const Get = createRouterMapping(RequestMethod.GET);
const Post = createRouterMapping(RequestMethod.POST);
const Delete = createRouterMapping(RequestMethod.DELETE);
const Options = createRouterMapping(RequestMethod.OPTIONS);
const Put = createRouterMapping(RequestMethod.PUT);
const Patch = createRouterMapping(RequestMethod.PATCH);


// pipe/guard/interceptor
function Guard() { return function(target) { }; }
function Pipe() { return function(target, key, descriptor) { }; }
function Interceptor() { return function(target, key, descriptor) { }; }


// controller
function Controller(prefix = '/') {
  return function(target) {
    Reflect.defineMetadata(PATH_METADATA, { prefix }, target);
  };
}

// resources
function Resources(name, prefix) {
  return function(target) {
    Reflect.defineMetadata(PATH_METADATA, { name, prefix, isRestful: true, proto: target.prototype }, target);
    return target;
  };
}


module.exports = {

  Pipe,
  Guard,
  Interceptor,

  UsePipes,
  UseGuards,
  UseInterceptors,

  Context,
  Request,
  Response,
  Body,
  Param,
  Query,
  Session,
  Headers,
  UploadedFile,
  UploadedFiles,


  Head,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Options,

  Resources,
  Restful: Resources,
  Controller,
};
