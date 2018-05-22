import { BaseContextClass, Context as CTX, Router, Request } from 'egg';
import { Observable } from 'rxjs';

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}


type ParamData = object | string | number;

type Paramtype = 'BODY' | 'QUERY' | 'PARAM' | 'CUSTOM';

export function Injectable(): any;

export function Context(): any;
export function Ctx(): any;
export function Request(): any;
export function Response(): any;
export function Req(): any;
export function Res(): any;
export function Param(data?: ParamData, ...pipes): any;
export function Query(data?: ParamData, ...pipes): any;
export function Body(data?: ParamData, ...pipes): any;
export function Headers(data?: ParamData): any;
export function Session(): any;
export function UploadedFile(): any;
export function UploadedFiles(opt?): any;

export function Head(name?: string, path?: string): any;
export function Get(name?: string, path?: string): any;
export function All(name?: string, path?: string): any;
export function Post(name?: string, path?: string): any;
export function Delete(name?: string, path?: string): any;
export function Options(name?: string, path?: string): any;
export function Put(name?: string, path?: string): any;
export function Patch(name?: string, path?: string): any;

export function Render(template: string): any;
export function Header(name: string, value: string): any;

export function UsePipes(...pipes: (PipeTransform | Function)[]): any;
export function UseGuards(...guards: (CanActivate | Function)[]): any;
export function UseInterceptors(...interceptors: (EggInterceptor | Function)[]): any;
export function UseFilters(...filters: (ExceptionFilter | Function)[]): any;

export function Controller(path?: string): any;
export function Resources(path: string): any;
export function Resources(name: string, path: string): any;
export function Restful(path: string): any;
export function Restful(name: string, path: string): any;


interface ArgumentMetadata {
  readonly type: Paramtype;
  readonly metatype?: new (...args) => any | undefined;
  readonly data?: string | undefined;
}
interface Type<T> extends Function {
  new(...args: any[]): T;
}

interface ExecutionContext {
  getClass<T = any>(): Type<T>;  // user for class 
  getHandler(): Function;    // classMethod 
}

interface IMiddleware {
  apply(...middleware: (Function | any)[]): this;
  forRoutes(...routes: (string | any)[]): this;
}

export abstract class CanActivate extends BaseContextClass {
  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}

export abstract class EggInterceptor<T=any, R=any> extends BaseContextClass {
  abstract intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<R> | Promise<Observable<R>>;
}

export abstract class PipeTransform<T = any, R = any> extends BaseContextClass {
  abstract transform(value: T, metadata: ArgumentMetadata): R;
}

export abstract class ExceptionFilter extends BaseContextClass {
  abstract catch(exception): any;
}

export function Catch(...exceptions): any;

export function createParamDecorator(factory: (data, req) => any): (data?: any, ...pipes) => any;


export class MiddlewareConsumer {
  static setRouter(router: Router): IMiddleware;
  static apply(...middleware: (Function | any)[]): IMiddleware;
}

export function ReflectMetadata(metadataKey, metadataValue): (target, key?, descriptor?) => any;



export class HttpException extends Error {

  readonly message: any;

  constructor(response: string | object, status: number);

  getResponse(): string | object;

  getStatus(): number;
}

export class ForbiddenException extends HttpException {
  constructor(message?: string | object | any, error = 'Forbidden');
}

export class BadRequestException extends HttpException {
  constructor(message?: string | object | any, error = 'Bad Request');
}

export class UnauthorizedException extends HttpException {
  constructor(message?: string | object | any, error = 'Unauthorized');
}

export class NotFoundException extends HttpException {
  constructor(message?: string | object | any, error = 'Not Found');
}

export class NotAcceptableException extends HttpException {
  constructor(message?: string | object | any, error = 'Not Acceptable');
}
export class RequestTimeoutException extends HttpException {
  constructor(message?: string | object | any, error = 'Request Timeout');
}

export class ConflictException extends HttpException {
  constructor(message?: string | object | any, error = 'Conflict');
}
export class GoneException extends HttpException {
  constructor(message?: string | object | any, error = 'Gone');
}
export class PayloadTooLargeException extends HttpException {
  constructor(message?: string | object | any, error = 'Payload Too Large');
}

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message?: string | object | any, error = 'Unsupported Media Type');
}

export class UnprocessableEntityException extends HttpException {
  constructor(message?: string | object | any, error = 'Unprocessable Entity');
}
export class InternalServerErrorException extends HttpException {
  constructor(message?: string | object | any, error = 'Internal Server Error');
}

export class NotImplementedException extends HttpException {
  constructor(message?: string | object | any, error = 'Not Implemented');
}

export class BadGatewayException extends HttpException {
  constructor(message?: string | object | any, error = 'Bad Gateway');
}

export class ServiceUnavailableException extends HttpException {
  constructor(message?: string | object | any, error = 'Service Unavailable');
}

export class GatewayTimeoutException extends HttpException {
  constructor(message?: string | object | any, error = 'Gateway Timeout');
}
