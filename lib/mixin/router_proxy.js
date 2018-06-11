'use strict';
require('reflect-metadata');
const is = require('is-type-of');
const { HttpStatus } = require('../exceptions/constant');
const { HttpException } = require('../exceptions/exception');
const { Observable, defer, from } = require('rxjs');
const { take, switchMap } = require('rxjs/operators');
const {
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
  RENDER_METADATA,
  HEADER_METADATA,
  RouteParamTypes,
} = require('../constants');
const utils = require('../utils');

take;

module.exports = {
  // param 处理
  reflectCallbackParamtypes(klass, key) {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, klass, key) || [];
    return Object.keys(args).reduce((arr, typeAndIndex) => {
      const [ type, index ] = typeAndIndex.split(':');
      const { data, pipes, factory } = args[typeAndIndex];
      arr.push({
        index,
        type,
        extractValue: this.extractValue(type, data),
        data,
        pipes,
        factory,
      });
      return arr;
    }, []);
  },


  createGuardsFn(guards, context) {
    if (!guards || !guards.length) {
      return null;
    }
    return async function tryActivate() {
      for (let guard of guards) {
        guard = Object.assign(guard, this);
        const result = await guard.canActivate(context);
        if (await pickResult(result)) {
          continue;
        } else {
          throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        }
      }
    };

    async function pickResult(result) {
      if (result instanceof Observable) {
        return await result.toPromise();
      }
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }
  },


  createPipesFn(pipes, callbackParamtypes, parmTypes, getPipeFn, getCustomFactory) {
    if (!callbackParamtypes || !callbackParamtypes.length) {
      return null;
    }
    return async function apply(args) {
      await Promise.all(callbackParamtypes.map(async param => {
        let value;
        let { index, type, data, pipes: paramPipes, factory, extractValue } = param;
        const metaType = parmTypes[index];
        const paramType = RouteParamTypes[type];
        paramPipes = getPipeFn(paramPipes);
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
          args[index] = await getParamValue.call(this,
            pipes.concat(paramPipes),
            value,
            {
              data,
              metaType,
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
        pipe = Object.assign(pipe, this);
        const result = pipe.transform(val, metadata);
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }, Promise.resolve(value));
    }
  },

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
  },


  createFinalHandler(proto, method) {
    const renderTemplate = this.reflectMethodMetadata(proto, method, RENDER_METADATA);
    const responseHeaders = this.reflectMethodMetadata(proto, method, HEADER_METADATA) || [];

    // render
    if (renderTemplate) {
      return async (result, ctx) => {
        setHeaders(responseHeaders, ctx);
        result = await transformToResult(result);
        await ctx.render(renderTemplate, result);
      };
    }

    return async (result, ctx) => {
      setHeaders(responseHeaders, ctx);
      result = await transformToResult(result);
      if (is.nullOrUndefined(result)) {
        return;
      }
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
      if (resultOrDeffered instanceof Promise) {
        return await resultOrDeffered;
      } else if (resultOrDeffered && is.function(resultOrDeffered.subscribe)) {
        return await resultOrDeffered.toPromise();
      }
      return resultOrDeffered;
    }
  },

  // for custom decorators
  getCustomFactory(factory) {
    return !is.undefined(factory) && is.function(factory)
      ? factory
      : () => null;
  },

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
  },

  createCallbackProxy(routerProperty, controller) {

    let { method, targetCallback } = routerProperty;

    const proto = controller.prototype;

    const guards = this.createGuards(proto, method);
    const context = this.createContext(proto, targetCallback);
    const canActivateFn = this.createGuardsFn(guards, context);

    const pipes = this.createPipes(proto, method);
    const getCustomFactory = this.getCustomFactory.bind(this);
    const getPipesInstance = this.getsFeaturesInstance.bind(this, this.loadInstanceForPipes);
    const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
    const paramTypes = this.reflectMethodMetadata(proto, method, PARAMTYPES_METADATA);
    const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes, getPipesInstance, getCustomFactory);

    const interceptors = this.createInterceptors(proto, method);
    const interceptorFn = this.createInterceptorsFn(interceptors, context);

    const finalHandler = this.createFinalHandler(proto, method);

    const filters = this.createFilters(proto, method);
    const exceptionHanlder = this.createExceptionHandler();
    exceptionHanlder.setCustomFilters(filters);

    targetCallback = utils.convertMiddleware(targetCallback);

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
          canActivateFn && await canActivateFn.call(this);
          // pipe and targetcallback
          const handler = async () => {
            canTransformFn && await canTransformFn.call(this, args);
            return await targetCallback.apply(this, args);
          };
          // intercept
          const result = await interceptorFn.call(this, handler);
          await finalHandler(result, this.ctx);
        }
      },
    }
    );
  },
};
