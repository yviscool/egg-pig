
const path = require('path');
const is = require('is-type-of');
const convert = require('koa-convert');
const { Observable } = require('rxjs/Observable');
const {
    RouteParamTypes,
    GUARDS_METADATA,
    INTERCEPTORS_METADATA,
    PIPES_METADATA,
    ROUTE_ARGS_METADATA,
    TARGETCALBACK_METADATA,
} = require('./constants');
require('reflect-metadata');
require('rxjs/add/operator/toPromise');
require('rxjs/add/observable/defer');
require('rxjs/add/operator/take');



module.exports = {

    createGuards(klass, key) {
        const classMetadata = this.reflectClassMetadata(klass, GUARDS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(klass, key, GUARDS_METADATA);
        return [
            ...this.getGuardsActive(classMetadata),
            ...this.getGuardsActive(methodMetadata),
        ]
    },

    createPipes(klass, key) {
        const classMetadata = this.reflectClassMetadata(klass, PIPES_METADATA);
        const methodMetadata = this.reflectMethodMetadata(klass, key, PIPES_METADATA);
        return [
            ...this.getPipesTransform(classMetadata),
            ...this.getPipesTransform(methodMetadata),
        ]
    },

    createInterceptors(klass, key) {
        const classMetadata = this.reflectClassMetadata(klass, INTERCEPTORS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(klass, key, INTERCEPTORS_METADATA);
        return [
            ...this.getInterceptor(classMetadata),
            ...this.getInterceptor(methodMetadata),
        ]
    },

    getGuardsActive(metadata) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype.canActivate)
            .filter(guard => guard && is.function(guard));
    },

    getPipesTransform(metadata) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype.transform)
            .filter(pipe => pipe && is.function(pipe));
    },

    getInterceptor(metadata) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype.intercept)
            .filter(pipe => pipe && is.function(pipe));
    },

    reflectClassMetadata(klass, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass.constructor);
    },

    reflectMethodMetadata(klass, key, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass, key);
    },


    // param 处理
    reflectCallbackParamtypes(klass, key) {
        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, klass, key) || [];
        return Object.keys(args).reduce((arr, typeAndIndex) =>{
            const [type, index] = typeAndIndex.split(':');
            const { data, pipes } = args[typeAndIndex];
            arr.push({
                index,
                type,
                data,
                pipes,
                extractValue: extractValue(type, data),
            })
            return arr;
        },[])
        function extractValue(key, data) {
            return function (ctx) {
                switch (key) {
                    case RouteParamTypes.CONTEXT:
                        return ctx;
                    case RouteParamTypes.REQUEST:
                        return ctx.request;
                    case RouteParamTypes.RESPONSE:
                        return ctx.response;
                    case RouteParamTypes.BODY:
                        return data && ctx.request.body ? ctx.request.body[data] : ctx.request.body;
                    case RouteParamTypes.PARAM:
                        return data ? ctx.params[data] : ctx.params;
                    case RouteParamTypes.QUERY:
                        return data ? ctx.query[data] : ctx.query;
                    case RouteParamTypes.HEADERS:
                        return data ? ctx.headers[data] : ctx.headers;
                    case RouteParamTypes.SESSION:
                        return ctx.session;
                    default:
                        return null;
                }
            }
        }
    },



    createGuardsFn(guards) {
        return async function (req, ctx) {
            for (const guard of guards) {
                const resultValue = await guard.call(this, req, ctx);
                if (!resultValue) this.ctx.throw(403);
            }
        }
    },

    createPipesFn(gpipes, callbackParamtypes, ctx) {
        return async function (args) {
            for (const { index, pipes, extractValue } of callbackParamtypes) {
                const paramPipes = ctx.getPipesTransform(pipes);
                const returnValue = await gpipes.concat(paramPipes).reduce(async (value, transform) => {
                    const val = await value;
                    const result = transform(val, this.ctx);
                    if (result instanceof Promise) {
                        return result;
                    }
                    return Promise.resolve(result);
                }, Promise.resolve(extractValue(this.ctx)));
                args[index] = returnValue;
            }
        }
    },

    createInterceptorsFn(interceptors) {
        return async function (req, callback, handler) {
            if (!interceptors || !interceptors.length) await handler();
            const start$ = Observable.defer(async () => await transformValue(handler));
            const result$ = await interceptors.reduce(async (stream$, intercept) => {
                return await intercept(req, await stream$);
            }, Promise.resolve(start$));
            return await result$.toPromise();
        }

        async function transformValue(next) {
            const res = await next();
            const isPromise = res instanceof Promise ;
            return isPromise ? res : Promise.resolve(res);
        }
    },

    createCallbackProxy(proto, key) {


        const targetCallback = this.convertMiddleware(proto[key]);

        const guards = this.createGuards(proto, key);
        const canActivateFn = this.createGuardsFn(guards);

        const pipes = this.createPipes(proto, key);
        const callbackParamtypes = this.reflectCallbackParamtypes(proto, key);
        const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, this);


        const interceptors = this.createInterceptors(proto, key);
        const interceptorFn = this.createInterceptorsFn(interceptors);

        Object.defineProperty(proto, key, {
            value: async function () {

                const args = Array.apply(null, { length: callbackParamtypes.length }).fill(null);
                
                // guard 
                canActivateFn && await canActivateFn.call(this, this.ctx.req, this.ctx);

                // pipe 
                const handler = async function handler() {
                    canTransformFn && await canTransformFn.call(this, args);
                    await targetCallback.apply(this, args);
                }

                //intercept
                await interceptorFn(this.ctx.req, targetCallback, handler.bind(this));
            }
        }
        )
    },

    createMethodsProxy(klass) {
        const proto = klass.prototype;
        const keys = Object.getOwnPropertyNames(proto);
        for (const key of keys) {
            if (key === 'constructor') continue;
            this.createCallbackProxy(proto, key);
        }
    },

    convertMiddleware(fn) {
        return is.generatorFunction(fn) ? convert(fn) : fn;
    }
}