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

function UseGuards(...guards) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(GUARDS_METADATA, guards, target, key);
            return descriptor;
        }
        Reflect.defineMetadata(GUARDS_METADATA, guards, target);
        return target;
    }
}

function UsePipes(...pipes) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(PIPES_METADATA, pipes, target, key);
            return descriptor;
        }
        Reflect.defineMetadata(GUARDS_METADATA, pipes, target);
        return target;
    }
}

function UseInterceptors(...interceptors) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target, key);
            return descriptor;
        }
        Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, target);
        return target;
    }
}

const Body = createMapping(RouteParamTypes.BODY);
const Param = createMapping(RouteParamTypes.PARAM);
const Query = createMapping(RouteParamTypes.QUERY);
const Context = createMapping(RouteParamTypes.CONTEXT);
const Request = createMapping(RouteParamTypes.REQUEST);
const Response = createMapping(RouteParamTypes.RESPONSE);
const Session = createMapping(RouteParamTypes.SESSION);
const Headers = createMapping(RouteParamTypes.HEADERS);

function Guard() { return function (target) { } };
function Pipe() { return function (target, key, descriptor) { } };
function Interceptor() { return function (target, key, descriptor) { } };

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
}