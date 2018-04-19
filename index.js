require('reflect-metadata');
const is = require('is-type-of');
const {
    RouteParamTypes,
    GUARDS_METADATA,
    INTERCEPTORS_METADATA,
    PIPES_METADATA,
    ROUTE_ARGS_METADATA,
    TARGETCALBACK_METADATA,
} = require('./lib/constants');

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

function setTargetCallback(proto, key) {
    let targetCallback;
    const { value, get } = Object.getOwnPropertyDescriptor(proto, key);
    const callback = Reflect.getMetadata(TARGETCALBACK_METADATA, proto, key);
    targetCallback = callback ? callback : value ? value : get;
    Reflect.defineMetadata(TARGETCALBACK_METADATA, targetCallback, proto, key);
}

function configureClassPig(klass, pigs, metadata) {
    const proto = klass.prototype;
    const keys = Object.getOwnPropertyNames(proto);
    for (const key of keys) {
        if (key === 'constructor') continue;
        setTargetCallback(proto, key);
        Reflect.defineMetadata(metadata, pigs, proto.constructor);
    }
}

function UseGuards(...guards) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(TARGETCALBACK_METADATA, descriptor.value, target, key);
            Reflect.defineMetadata(GUARDS_METADATA, guards, target, key);
            return Object.getOwnPropertyDescriptor(target, key);
        }
        configureClassPig(target, guards, GUARDS_METADATA);
        return target;
    }
}

function UsePipes(...pipes) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(TARGETCALBACK_METADATA, descriptor.value, target, key);
            Reflect.defineMetadata(PIPES_METADATA, pipes, target, key);
            return Object.getOwnPropertyDescriptor(target, key);
        }
        configureClassPig(target, pipes, PIPES_METADATA);
        return target;
    }
}

function UseInterceptors(...interceptors) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(TARGETCALBACK_METADATA, descriptor.value, target, key);
            Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target, key);
            return Object.getOwnPropertyDescriptor(target, key);
        }
        configureClassPig(target, interceptors, INTERCEPTORS_METADATA);
        return target;
    }
}

const Body = createMapping(RouteParamTypes.BODY);
const Param = createMapping(RouteParamTypes.PARAM);
const Query = createMapping(RouteParamTypes.QUERY);
const Context = createMapping(RouteParamTypes.CONTEXT);
const Request = createMapping(RouteParamTypes.REQUEST);
const Response = createMapping(RouteParamTypes.RESPONSE);

function Guard() { return function (target) { } };
function Pipe() { return function (target, key, descriptor) { } };
function Interceptor() { return function (target, key, descriptor) { } };

module.exports = {
    Guard,
    Pipe,
    Interceptor,
    UseGuards,
    UsePipes,
    UseInterceptors,
    Context,
    Request,
    Response,
    Body,
    Param,
    Query,
}