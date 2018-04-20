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

    createGuards(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, GUARDS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, GUARDS_METADATA);
        return [
            ...this.getPigs(classMetadata, 'canActivate'),
            ...this.getPigs(methodMetadata, 'canActivate'),
        ]
    },

    createPipes(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, PIPES_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, PIPES_METADATA);
        return [
            ...this.getPigs(classMetadata, 'transform'),
            ...this.getPigs(methodMetadata, 'transform'),
        ]
    },

    createInterceptors(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, INTERCEPTORS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, INTERCEPTORS_METADATA);
        return [
            ...this.getPigs(classMetadata, 'intercept'),
            ...this.getPigs(methodMetadata, 'intercept'),
        ]
    },

    getPigs(metadata, methoeName) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype[methoeName])
            .filter(guard => guard && is.function(guard));
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
        return Object.keys(args).reduce((arr, typeAndIndex) => {
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
        }, [])
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
        if (!guards || !guards.length) {
            return null;
        }
        return async function (req, ctx) {
            for (const guard of guards) {
                const resultValue = await guard.call(this, req, ctx);
                if (!resultValue) this.ctx.throw(403);
            }
        }
    },

    createPipesFn(gpipes, callbackParamtypes) {
        return async function (args, ctx) {
            await Promise.all(callbackParamtypes.map(async param => {
                const { index, type, pipes, extractValue } = param;
                const value = extractValue(ctx);
                const paramPipes = this.getPigs(pipes, 'transform');
                if (
                    type === RouteParamTypes.QUERY || 
                    type === RouteParamTypes.PARAM || 
                    type === RouteParamTypes.BODY
                ) {
                    const returnValue = await gpipes.concat(paramPipes).reduce(async (value, transform) => {
                        const val = await value;
                        const result = transform(val, ctx);
                        if (result instanceof Promise) {
                            return result;
                        }
                        return Promise.resolve(result);
                    }, Promise.resolve(value));
                    args[index] = returnValue;
                } else {
                    args[index] = value;
                }
            }))
        }
    },

    createInterceptorsFn(interceptors) {
        return async function (req, callback, handler) {
            if (!interceptors || !interceptors.length) return await handler();
            const start$ = Observable.defer(async () => await transformValue(handler));
            const result$ = await interceptors.reduce(async (stream$, intercept) => {
                return await intercept(req, await stream$);
            }, Promise.resolve(start$));
            return await result$.toPromise();
        }

        async function transformValue(next) {
            const res = await next();
            const isPromise = res instanceof Promise;
            return isPromise ? res : Promise.resolve(res);
        }
    },

    createCallbackProxy({ proto, method, targetCallback }) {

        const guards = this.createGuards(proto, method);
        const canActivateFn = this.createGuardsFn(guards);

        const pipes = this.createPipes(proto, method);
        const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
        const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, this).bind(this);


        const interceptors = this.createInterceptors(proto, method);
        const interceptorFn = this.createInterceptorsFn(interceptors);

        targetCallback = this.convertMiddleware(targetCallback);

        Object.defineProperty(proto, method, {
            value: async function () {


                const args = Array.apply(null, { length: callbackParamtypes.length }).fill(null);

                // guard 
                canActivateFn && await canActivateFn.call(this, this.ctx.req, this.ctx);

                // pipe and targetcallback
                const handler = async function handler() {
                    canTransformFn && await canTransformFn(args, this.ctx);
                    await targetCallback.apply(this, args);
                }

                //intercept
                await interceptorFn(this.ctx.req, targetCallback, handler.bind(this));
            }
        }
        )
    },

    createMethodsProxy(app) {
        const controllerModules = this.requireAll(app);
        const controllers = this.loadModules(controllerModules);
        const routers = this.scanForControllers(controllers);
        routers.map(router => {
            this.createCallbackProxy(router);
        })
    },


    requireAll(app) {
        return require('require-all')({
            dirname: path.join(app.baseDir, 'app/controller'),
            filter: /(.+)\.(ts|js)$/,
            recursive: true,
        })
    },

    scanForControllers(controllers) {
        return controllers.reduce((arr, controller) => {
            const proto = controller.prototype;
            const router = Object.getOwnPropertyNames(proto)
                .filter(method => is.function(proto[method]) && method !== 'constructor')
                .map(method => (
                    {
                        proto,
                        method,
                        targetCallback: proto[method]
                    }
                ))
            return arr.concat(router);
        }, [])
    },

    loadModules(modules) {
        return Object.values(modules)
            .map(module => {
                return module.__esModule
                    ? ('default' in module ? module.default : module)
                    : module;
            })
    },

    convertMiddleware(fn) {
        return is.generatorFunction(fn) ? convert(fn) : fn;
    },
}