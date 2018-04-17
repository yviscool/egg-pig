const is = require('is-type-of')
require('reflect-metadata')

const targetfnc = Symbol('targetfnc');

const RouteParamTypes = {
    'QUERY': '0',
    '0': 'QUERY',
    'BODY': '1',
    '1': 'BODY',
    'PARAM': '2',
    '2': 'PARAM',
    'CONTEXT': '3',
    '3': 'CONTEXT',
    'REQUEST': '4',
    '4': 'REQUEST',
    'RESPONSE': '5',
    '5': 'RESPONSE',
    'HEADERS': '6',
    '6': 'HEADERS',
    'SESSION': '7',
    '7': 'SESSION',
}

const GUARDS_METADATA = 'guards_metadata';
const PIPES_METADATA = 'pipes_metadata';
const ROUTE_ARGS_METADATA = 'route-args-metadata';

function Guard() { return function (target) { } }
function Pipe() { return function (target, key, descriptor) { } }
function Interceptor() { return function (target, key, descriptor) { } }

function createMapping(paramType) {
    return function (data, ...pipes) {
        return (target, key, index) => {
            const paramData = is.function(data) ? undefined : data;
            const paramPipe = is.function(data) ? [data, ...pipes] : pipes;
            const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key);
            Reflect.defineMetadata(ROUTE_ARGS_METADATA, {
                ...args,
                [`${paramType}:${index}`]: {
                    index,
                    data: paramData,
                    pipes: paramPipe,
                }
            }, target, key);
        }
    }
}


const Context = createMapping(RouteParamTypes.CONTEXT);
const Request = createMapping(RouteParamTypes.REQUEST);
const Response = createMapping(RouteParamTypes.RESPONSE);
const Body = createMapping(RouteParamTypes.BODY);
const Param = createMapping(RouteParamTypes.PARAM);
const Query = createMapping(RouteParamTypes.QUERY);


class PigConsumer {
    constructor() {
        this.cache = new Set();
        this.core = {};
    }

    getClass(target) {
        const flag = is.function(target);
        return {
            klass: flag ? target.prototype : target,
            name: flag ? target.name : target.constructor.name
        };
    }

    /*-----------------------guard----------------------*/
    createGuards(klass, key) {
        const classMetadata = this.reflectClassMetadata(klass, GUARDS_METADATA);
        const methodMetadata = this.reflectMethodMetadata(klass, key, GUARDS_METADATA);
        return [
            ...this.getGuardsActive(classMetadata),
            ...this.getGuardsActive(methodMetadata),
        ]
    }

    /*-----------------------pipe----------------------*/
    createPipes(klass, key) {
        const classMetadata = this.reflectClassMetadata(klass, PIPES_METADATA);
        const methodMetadata = this.reflectMethodMetadata(klass, key, PIPES_METADATA);
        return [
            ...this.getPipesTransform(classMetadata),
            ...this.getPipesTransform(methodMetadata),
        ]
    }

    getGuardsActive(metadata) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype.canActivate)
            .filter(guard => guard && is.function(guard));
    }

    getPipesTransform(metadata) {
        if (is.undefined(metadata) || is.null(metadata)) {
            return [];
        }
        return metadata
            .filter(metatype => metatype && metatype.name)
            .map(wrapper => wrapper.prototype.transform)
            .filter(pipe => pipe && is.function(pipe));
    }


    reflectClassMetadata(klass, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass.constructor);
    }

    reflectMethodMetadata(klass, key, metadataKey) {
        return Reflect.getMetadata(metadataKey, klass, key);
    }

    /*-----------------------guard, pipe ----------------------*/

    // param 处理
    reflectCallbackParamtypes(klass, key) {
        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, klass, key) || [];
        const arr = [];
        for (const typeAndIndex of Object.keys(args)) {
            const [type, index] = typeAndIndex.split(':');
            const { data, pipes } = args[typeAndIndex];
            arr.push({
                index,
                type,
                data,
                pipes,
                extractValue: extractValue(type, data),
            })
        }
        return arr;
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
    }


    getProxy(klass, key) {
        const ctx = this;
        const { name } = this.getClass(klass);
        const targetCallback = ctx.core[name][key];
        Object.defineProperty(klass, key, {
            value :
                async function () {
                    // guard 
                    const guards = ctx.createGuards(klass, key);
                    for (const guard of guards) {
                        const resultValue = await guard.call(this, this.ctx.req, this.ctx);
                        if (!resultValue) this.ctx.throw(403);
                    }

                    // pipe 
                    // 参数处理
                    const gpipes = ctx.createPipes(klass, key);
                    const arr = ctx.reflectCallbackParamtypes(klass, key);
                    const args = Array.apply(null, { length: arr.length }).fill(null);
                    for (const { index, pipes, extractValue } of arr) {
                        const ppipes = ctx.getPipesTransform(pipes);
                        const returnValue = await gpipes.concat(ppipes).reduce(async (value, transform) => {
                            const val = await value;
                            const result = transform(val, this.ctx);
                            if (result instanceof Promise) {
                                return result;
                            }
                            return Promise.resolve(result);
                        }, Promise.resolve(extractValue(this.ctx)));
                        args[index] = returnValue;
                    }
                    
                    await targetCallback.apply(this, args);
                }
            }
        )
    }

    getTargetCallback(klass, key, t) {
        const { value, get } = Object.getOwnPropertyDescriptor(klass, key);
        return t[key]
            ? t[key]
            : value
                ? value
                : get;
    }

    configureClassPig(klass, pigs, t, metadata) {
        for (const key of Object.getOwnPropertyNames(klass)) {
            if (key === 'constructor') continue;
            t[key] = this.getTargetCallback(klass, key, t);
            Reflect.defineMetadata(metadata, pigs, klass.constructor);
        }
    }

    createMethodsProxy(klass, target) {
        for (const key of Object.getOwnPropertyNames(target)) {
            this.getProxy(klass, key);
        }

    }

}

PigConsumer.UseGuards = function UseGuards(...guards) {
        return (target , key, descriptor) => {

            const { klass, name } = pig.getClass(target);

            if (!pig.core[name]) pig.core[name] = {};

            const t = pig.core[name];


            if (descriptor) {
                t[key] = descriptor.value;
                Reflect.defineMetadata(GUARDS_METADATA, guards, target, key);
                this.getProxy(klass, key);
                return Object.getOwnPropertyDescriptor(klass, key);
            }

            this.configureClassPig(klass, guards, t, GUARDS_METADATA);

            this.createMethodsProxy(klass, t);

            return target;

        }
    }

 PigConsumer.UsePipes  =  function  UsePipes(...pipes) {
        return (target, key, descriptor) => {

            const { klass, name } = pig.getClass(target);

            if (!pig.core[name]) pig.core[name] = {};

            const t = pig.core[name];

            if (descriptor) {
                t[key] = descriptor.value;
                Reflect.defineMetadata(PIPES_METADATA, pipes, target, key);
                this.getProxy(klass, key);
                return Object.getOwnPropertyDescriptor(klass, key);
            }

            // 配置函数级别的 pipe ,guard ,interceptror
            this.configureClassPig(klass, pipes, t, PIPES_METADATA);

            //创建所有实例方法代理
            this.createMethodsProxy(klass, t);

            return target;

        }

    }

var pig = new PigConsumer();

const UseGuards = PigConsumer.UseGuards.bind(pig);
const UsePipes = PigConsumer.UsePipes.bind(pig);

module.exports = {
    Guard,
    Pipe,
    Interceptor,
    UseGuards,
    UsePipes,
    Context ,
    Request ,
    Response,
    Body ,
    Param ,
    Query ,
}