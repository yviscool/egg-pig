'use strict';
const is = require('is-type-of');
const { HttpStatus } = require('../exceptions/constant');
const { ForbiddenException } = require('../exceptions/exception');
const { switchMap, mergeAll } = require('rxjs/operators');
const { Observable, defer, from } = require('rxjs');
const {
  RequestMethod,
  RouteParamTypes,
  RENDER_METADATA,
  HEADER_METADATA,
  ROUTE_ARGS_METADATA,
  HTTP_CODE_METADATA,
  ROUTE_OPTIONS_METADATA,
} = require('../constants');

const { getMethodDataFromClass, getClassMetadata, getParamTypes } = require('../decorator_manager');


class RouterProxy {

  constructor(contextCreator, exceptionHandler, routerParamFactory) {
    this.contextCreator = contextCreator;
    this.exceptionHandler = exceptionHandler;
    this.routerParamFactory = routerParamFactory;
  }

  // param 处理
  reflectCallbackParamtypes(klass, key) {
    const args = getMethodDataFromClass(ROUTE_ARGS_METADATA, klass, key) || {};
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
    const canActivateFn = async function() {
      const pickResult = async result => (result instanceof Observable
        ? await result.toPromise()
        : result);
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

    return guards.length ? canActivateFn : null;
  }


  createPipesFn(pipes, callbackParamtypes, parmTypes) {
    const { getsFeaturesInstance, loadInstanceForPipes } = this.contextCreator;
    const getCustomFactory = this.getCustomFactory.bind(this);
    const getPipesInstance = getsFeaturesInstance.bind(this, loadInstanceForPipes);
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

          const allPipes = pipes.concat(paramPipes).map(pipe => Object.assign(pipe, this));

          args[index] = await getParamValue(
            allPipes,
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
      if (!interceptors || !interceptors.length) return handler();
      const start$ = defer(() => transformValue(handler));
      const nextFn = (i = 0) => async () => {
        if (i >= interceptors.length) {
          return start$;
        }
        const handler = {
          handle: () => from(nextFn(i + 1)()).pipe(mergeAll()),
        };
        const interceptor = Object.assign(interceptors[i], this);
        return interceptor.intercept(context, handler);
      };
      return nextFn()();
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

  createFinalHandler(controller, method) {
    const isEmpty = array => !(array && array.length > 0);
    const httpCode = getMethodDataFromClass(HTTP_CODE_METADATA, controller, method);
    const renderTemplate = getMethodDataFromClass(RENDER_METADATA, controller, method);
    const responseHeaders = getMethodDataFromClass(HEADER_METADATA, controller, method);
    const routerOptionsMetadatas = getClassMetadata(ROUTE_OPTIONS_METADATA, controller) || [];
    const routerOptionMetadata = routerOptionsMetadatas.filter(data => data.method === method);
    const { requestMethod } = routerOptionMetadata.length >= 1 ? routerOptionMetadata[0] : {};
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
  createContext(controller, method) {
    return {
      getClass() {
        return controller;
      },
      getHandler() {
        return method;
      },
    };
  }

  createCallbackProxy(routerProperty, controller) {


    const { method, targetCallback } = routerProperty;
    const { pipes, guards, filters, interceptors } = this.contextCreator.createFeatures(controller, method);


    const context = this.createContext(controller, targetCallback);
    const fnCanActivate = this.createGuardsFn(guards, context);

    const paramTypes = getParamTypes(controller, method);
    const callbackParamtypes = this.reflectCallbackParamtypes(controller, method);
    const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes);

    const interceptorFn = this.createInterceptorsFn(interceptors, context);
    const fnHandleResponse = this.createFinalHandler(controller, method);


    const exceptionHanlder = this.exceptionHandler.create(filters.reverse());


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

    Object.defineProperty(controller.prototype, method, {
      async value() {

        try {
          await callbackProxy.call(this);
        } catch (e) {
          exceptionHanlder.next(e, this);
        }

      },
      writable: false,
      configurable: false,
    }
    );

  }

}

module.exports = RouterProxy;
