const is = require('is-type-of');
const path = require('path');
const convert = require('koa-convert');
const EggRouter = require('egg-core/lib/utils/router');
const inflection = require('inflection');
const { Observable } = require('rxjs/Observable');
const BaseContextClass = require('egg-core/lib/utils/base_context_class');
const {
    GUARDS_METADATA,
    PIPES_METADATA,
    INTERCEPTORS_METADATA,
    ROUTE_ARGS_METADATA,
    PARAMTYPES_METADATA,
    PATH_METADATA,
    METHOD_METADATA,
    ROUTE_NAME_METADATA,
    ImplementMethods,
    RouteParamTypes,
    RequestMethod,
    REST_MAP,
} = require('./constants');
require('reflect-metadata');
require('rxjs/add/operator/toPromise');
require('rxjs/add/observable/defer');
require('rxjs/add/operator/take');



module.exports = {

    modules: {},
    createGuards(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, GUARDS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, GUARDS_METADATA);
        return [
            ...this.getPigs(classMetadata, ImplementMethods.canActivate),
            ...this.getPigs(methodMetadata, ImplementMethods.canActivate)
        ]
    },

    createPipes(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, PIPES_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, PIPES_METADATA);
        return [
            ...this.getPigs(classMetadata, ImplementMethods.transform),
            ...this.getPigs(methodMetadata, ImplementMethods.transform)
        ]

    },

    createInterceptors(proto, key) {
        const classMetadata = this.reflectClassMetadata(proto, INTERCEPTORS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(proto, key, INTERCEPTORS_METADATA);
        return [
            ...this.getPigs(classMetadata, ImplementMethods.intercept),
            ...this.getPigs(methodMetadata, ImplementMethods.intercept)
        ]
    },


    // get pipes transfrom/guards canActivte/interceptors intercept
    getPigs(metadata, methoeName) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype[methoeName])
            .filter(method => method && is.function(method));
    },


    reflectClassMetadata(klass, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass.constructor);
    },

    reflectMethodMetadata(klass, key, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass, key);
    },

    //get ctx(context/request,response,body/param/queyr/headers/seesion);
    extractValue(key, data) {
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
                extractValue: this.extractValue(type, data),
            })
            return arr;
        }, [])
    },


    createGuardsFn(guards, context) {
        if (!guards || !guards.length) {
            return null;
        }
        return async function (req) {
            for (const guard of guards) {
                const resultValue = await guard.call(this, req, context);
                if (!resultValue) this.ctx.throw(403);
            }
        }
    },

    createPipesFn(gpipes, callbackParamtypes, parmTypes) {
        return async function (args, self) {
            await Promise.all(callbackParamtypes.map(async param => {
                const { index, type, data, pipes, extractValue } = param;
                const value = extractValue(self.ctx);
                const metaType = parmTypes[index];
                const paramType = RouteParamTypes[type];
                const paramPipes = this.getPigs(pipes, 'transform');
                if (
                    type === RouteParamTypes.QUERY ||
                    type === RouteParamTypes.PARAM ||
                    type === RouteParamTypes.BODY
                ) {
                    const returnValue = await gpipes.concat(paramPipes).reduce(async (value, transform) => {
                        const val = await value;
                        const result = transform.call(self, val, {
                            data,
                            metaType,
                            type: paramType
                        });
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

    createInterceptorsFn(interceptors, context) {
        return async function (req, callback, handler) {
            if (!interceptors || !interceptors.length) return await handler();
            const start$ = Observable.defer(async () => await transformValue(handler));
            const result$ = await interceptors.reduce(async (stream$, intercept) => {
                return await intercept.call(this, req, context, await stream$);
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
        const context = this.createContext(proto, method);
        const canActivateFn = this.createGuardsFn(guards, context);

        const pipes = this.createPipes(proto, method);
        const paramTypes = this.reflectMethodMetadata(proto, method, PARAMTYPES_METADATA);
        const callbackParamtypes = this.reflectCallbackParamtypes(proto, method);
        const canTransformFn = this.createPipesFn(pipes, callbackParamtypes, paramTypes).bind(this);


        const interceptors = this.createInterceptors(proto, method);
        const interceptorFn = this.createInterceptorsFn(interceptors, context);

        targetCallback = this.convertMiddleware(targetCallback);

        this.createModules(proto, method);

        Object.defineProperty(proto, method, {
            value: async function () {


                const args = Array.apply(null, { length: callbackParamtypes.length }).fill(null);

                // guard 
                canActivateFn && await canActivateFn.call(this, this.ctx.req);

                // pipe and targetcallback
                const handler = async function handler() {
                    canTransformFn && await canTransformFn(args, this);
                    await targetCallback.apply(this, args);
                }

                //intercept
                await interceptorFn.call(this, this.ctx.req, targetCallback, handler.bind(this));
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

    // create guard context
    createContext(proto, method) {
        return {
            parent: proto.constructor,
            handler: proto[method],
        }
    },

    convertMiddleware(fn) {
        return is.generatorFunction(fn) ? convert(fn) : fn;
    },

    createModules(proto, method) {
        const name = proto.constructor.name;
        const path = this.reflectMethodMetadata(proto, method, PATH_METADATA);
        const routeName = this.reflectMethodMetadata(proto, method, ROUTE_NAME_METADATA);
        const requestMethod = this.reflectMethodMetadata(proto, method, METHOD_METADATA);
        const controlerMetadata = this.reflectClassMetadata(proto, PATH_METADATA);
        const module = this.modules[name] ? this.modules[name] : this.modules[name] = [];
        module.metadata = controlerMetadata;
        path && module.push({
            path: this.validatePath(path),
            proto,
            method,
            routeName,
            requestMethod, // 0('get) 1('post') ..
        })
    },

    resolveRouters(app) {
        Object.keys(this.modules).forEach(key => {
            const pathProperties = this.modules[key] || [];
            const router = this.createRouter(app);
            let { name = '', prefix = name, isRestful, proto } = pathProperties.metadata;
            for (const pathProperty of pathProperties) {
                const {
                    path,
                    proto,
                    method,
                    routeName,
                    requestMethod,
                } = pathProperty;
                const targetcallback = this.methodToMiddleware(proto[method]);
                const routerMethod = this.getRouterMethod(router, requestMethod);
                const args = routeName ? [routeName, path, targetcallback] : [path, targetcallback];
                routerMethod(...args);
            }
            prefix = this.validatePath(prefix);
            if (prefix && isRestful) {
                // resources verb 
                this.register(proto, router, { name, prefix: '//' });
            }
            // ensure egg.router.verb before egg.router.use()
            app.beforeStart(() => {
                app.router.use(prefix, router.routes());
            });
        })

    },

    createRouter(app) {
        return new EggRouter({ sensitive: true }, app);
    },

    getRouterMethod(router, method) {
        const methodName /*get, post..*/ = RequestMethod[method];
        return router[methodName].bind(router);
    },

    // rewrite register because app.controller is not defined
    register(controller, router, { name, prefix }) {
        for (const key in REST_MAP) {
            let action = controller[key];
            if (!action) continue;
            action = this.methodToMiddleware(action);
            const opts = REST_MAP[key];
            let formatedName;
            if (opts.member) {
                formatedName = inflection.singularize(name || prefix);
            } else {
                formatedName = inflection.pluralize(name || prefix);
            }
            if (opts.namePrefix) {
                formatedName = opts.namePrefix + formatedName;
            }
            prefix = prefix.replace(/\/$/, '');
            const path = opts.suffix ? `${prefix}/${opts.suffix}` : prefix;
            const method = Array.isArray(opts.method) ? opts.method : [opts.method];
            router.register(path, method, action, { name: formatedName });
        }
    },

    validatePath(path) {
        return path.charAt(0) !== '/' ? '/' + path : path;
    },

    // loadCustom 阶段如果要用装饰路由就得重新绑定 ctx;
    methodToMiddleware(fn) {
        return function classControllerMiddleware(...args) {
            const controller = new BaseContextClass(this);
            return fn.call(controller, ...args)
        };
    },
}