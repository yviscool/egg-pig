'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const { HttpStatus } = require('../exceptions/constant');
const { ForbiddenException } = require('../exceptions/exception');
const { switchMap } = require('rxjs/operators');
const { Observable, defer, from } = require('rxjs');
const {
  RequestMethod,
  RouteParamTypes,
  METHOD_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
  HTTP_CODE_METADATA,
} = require('../constants');


class RouterProxy {

  constructor(contextCreator, exceptionHandler, routerParamFactory, reflector) {
    this.contextCreator = contextCreator;
    this.exceptionHandler = exceptionHandler;
    this.routerParamFactory = routerParamFactory;
    this.reflector = reflector;
  }

  // param 处理
  reflectCallbackParamtypes(klass, key) {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, klass, key) || [];
    const { extractValue } = this.routerParamFactory;
    return Object.keys(args).reduce((arr, typeAndIndex) => {
      const [ type, index ] = typeAndIndex.split(':');
      const { data, pipes, factory } = args[typeAndIndex];
      arr.push({
        index,
        type,
        data,
        pipes,
        factory,
        extractValue: extractValue(type, data),
      });
      return arr;
    }, []);
  }


  createGuardsFn(guards, context) {
    if (!guards || !guards.length) {
      return null;
    }

    const canActivateFn = async function() {
      for (let guard of guards) {
        guard = Object.assign(guard, this);
        const result = await guard.canActivate(context);
        if (await pickResult(result)) {
          continue;
        } else {
          throw new ForbiddenException('Forbidden resource');
        }
      }
    };

    async function pickResult(result) {
      if (result instanceof Observable) {
        return await result.toPromise();
      }
      return result;
    }

    return guards.length ? canActivateFn : null;
  }


  createPipesFn(pipes, callbackParamtypes, parmTypes) {
    const { getsFeaturesInstance, loadInstanceForPipes } = this.contextCreator;
    const getCustomFactory = this.getCustomFactory.bind(this);
    const getPipesInstance = getsFeaturesInstance.bind(this, loadInstanceForPipes);
    // if (!callbackParamtypes || !callbackParamtypes.length) {
    //   return null;
    // }
    const pipesFn = async function(args) {
      await Promise.all(callbackParamtypes.map(async param => {
        let value;
        let { index, type, data, pipes: paramPipes, factory, extractValue } = param;
        const metatype = parmTypes[index];
        const paramType = RouteParamTypes[type];
        paramPipes = getPipesInstance(paramPipes);
        if (factory) {
          value = getCustomFactory(factory)(data, this.ctx);
        } else {
          value = await extractValue(this.ctx);
        }
        if (
          type === RouteParamTypes.QUERY ||
          type === RouteParamTypes.PARAM ||
          type === RouteParamTypes.BODY ||
          is.string(type)
        ) {

          pipes = pipes.concat(paramPipes).map(pipe => Object.assign(pipe, this));

          args[index] = await getParamValue(
            pipes,
            value,
            {
              data,
              metatype,
              type: paramType,
            });
        } else {
          args[index] = value;
        }
      }));
    };

    async function getParamValue(pipes, value, metadata) {
      return await pipes.reduce(async (value, pipe) => {
        const val = await value;
        // pipe = Object.assign(pipe, this);
        const result = pipe.transform(val, metadata);
        return result;
      }, Promise.resolve(value));
    }

    return callbackParamtypes.length ? pipesFn : null;
  }

  createInterceptorsFn(interceptors, context) {
    return async function intercept(handler) {
      if (!interceptors || !interceptors.length) return await handler();
      const start$ = defer(() => transformValue(handler));
      const result$ = await interceptors.reduce(async (stream$, interceptor) => {
        interceptor = Object.assign(interceptor, this);
        return await interceptor.intercept(context, await stream$);
      }, Promise.resolve(start$));
      return await result$.toPromise();
    };

    function transformValue(next) {
      return from(next()).pipe(
        switchMap(res => {
          const isDeffered = res instanceof Promise || res instanceof Observable;
          return isDeffered ? res : Promise.resolve(res);
        })
      );
    }
  }

  createFinalHandler(proto, method) {
    const { reflectMethodMetadata } = this.reflector;
    const isEmpty = array => !(array && array.length > 0);
    const httpCode = reflectMethodMetadata(proto, method, HTTP_CODE_METADATA);
    const requestMethod = reflectMethodMetadata(proto, method, METHOD_METADATA);
    const renderTemplate = reflectMethodMetadata(proto, method, RENDER_METADATA);
    const responseHeaders = reflectMethodMetadata(proto, method, HEADER_METADATA);
    const httpStatusCode = httpCode ? httpCode : requestMethod === RequestMethod.POST ? HttpStatus.CREATED : HttpStatus.OK;
    const hasCustomHeaders = !isEmpty(responseHeaders);
    // render
    if (renderTemplate) {
      return async (result, ctx) => {
        hasCustomHeaders && setHeaders(responseHeaders, ctx);
        result = await transformToResult(result);
        await ctx.render(renderTemplate, result);
      };
    }

    return async (result, ctx) => {
      hasCustomHeaders && setHeaders(responseHeaders, ctx);
      result = await transformToResult(result);
      if (is.nullOrUndefined(result)) return;
      ctx.status = httpStatusCode;
      ctx.body = result;
    };

    function setHeaders(headers, ctx) {
      headers.forEach(({ name, value }) => {
        // name => { key:value, key:value}
        if (!value) {
          ctx.set(name);
          return;
        }
        ctx.set(name, value);
      });
    }

    async function transformToResult(resultOrDeffered) {
      if (resultOrDeffered && is.function(resultOrDeffered.subscribe)) {
        return await resultOrDeffered.toPromise();
      }
      return resultOrDeffered;
    }
  }

  // for custom decorators
  getCustomFactory(factory) {
    return !is.undefined(factory) && is.function(factory)
      ? factory
      : () => null;
  }

  //  use context for guard/interceptor
  createContext(proto, method) {
    return {
      getClass() {
        return proto.constructor;
      },
      getHandler() {
        return method;
      },
    };
  }

  createCallbackProxy(routerProperty, controller) {


    const proto = controller.prototype;
    const { method, targetCallback } = routerProperty;
    const { pipes, guards, filters, interceptors } = this.contextCreator.createFeatures(proto, method);

    const context = this.createContext(proto, targetCallback);
    const fnCanActivate = this.createGuardsFn(guards, context);

    const paramTypes = this.reflector.reflectMethodMetadata(proto, method, PARAMTYPES_METADATA);
    const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
    const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes);

    const interceptorFn = this.createInterceptorsFn(interceptors, context);
    const fnHandleResponse = this.createFinalHandler(proto, method);

    const exceptionHanlder = this.exceptionHandler.create(filters.reverse());

    Object.defineProperty(proto, method, {
      async value() {

        try {
          await callbackProxy.call(this);
        } catch (e) {
          exceptionHanlder.next(e, this);
        }

        async function callbackProxy() {
          const args = Array.apply(null, { length: callbackParamtypes.length }).fill(null);
          // guard
          fnCanActivate && await fnCanActivate.call(this);
          // pipe and targetcallback
          const handler = async () => {
            canTransformFn && await canTransformFn.call(this, args);
            return await targetCallback.apply(this, args);
          };
          // intercept
          const result = await interceptorFn.call(this, handler);
          await fnHandleResponse(result, this.ctx);
        }
      },
    }
    );
  }

}

module.exports = RouterProxy;
