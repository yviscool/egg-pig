import { BaseContextClass, Router } from 'egg';
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

export enum RequestMethod {
  GET = '0',
  POST = '1',
  PUT = '2',
  DELETE = '3',
  PATCH = '4',
  ALL = '5',
  OPTIONS = '6',
  HEAD = '7',
};



type ParamData = object | string | number;

type Paramtype = 'BODY' | 'QUERY' | 'PARAM' | 'CUSTOM';

interface GetFileStreamOptions {
  requireFile?: boolean; // required file submit, default is true
  defCharset?: string;
  limits?: {
    fieldNameSize?: number;
    fieldSize?: number;
    fields?: number;
    fileSize?: number;
    files?: number;
    parts?: number;
    headerPairs?: number;
  };
  checkFile?(
    fieldname: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string
  ): void | Error;
}

interface GetFilesStreamOptions extends GetFileStreamOptions {
  autoFields?: boolean; 
}


export function Injectable(): any;

export function Context(): (target, key, index: number) => any;
export function Ctx(): (target, key, index: number) => any;
export function Request(): (target, key, index: number) => any;
export function Response(): (target, key, index: number) => any;
export function Req(): (target, key, index: number) => any;
export function Res(): (target, key, index: number) => any;
export function Headers(property?: string): (target, key, index: number) => any;
export function Session(): (target, key, index: number) => any;
export function UploadedFile(): (target, key, index: number) => any;
export function UploadedFiles(): (target, key, index: number) => any;
export function UploadedFileStream(opts?: GetFileStreamOptions): (target, key, index: number) => any;
export function UploadedFilesStream(opts?: GetFilesStreamOptions): (target, key, index: number) => any;

export function Param(): (target, key, index: number) => any;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;
export function Param(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;

export function Query(): (target, key, index: number) => any;
export function Query(...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;
export function Query(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;

export function Body(): (target, key, index: number) => any;
export function Body(...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;
export function Body(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): (target, key, index: number) => any;


export function Head(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Get(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function All(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Post(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Delete(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Options(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Put(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Patch(name?: string, path?: string): (target, key, descriptor: PropertyDescriptor) => any;

export function Render(template: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Header(name: string, value: string): (target, key, descriptor: PropertyDescriptor) => any;
export function Header(obj: object): (target, key, descriptor: PropertyDescriptor) => any;
export function HttpCode(statusCode: number): (target, key, descriptor: PropertyDescriptor) => any;

export function UsePipes(...pipes: (PipeTransform | Function)[]): any;
export function UseGuards(...guards: (CanActivate | Function)[]): any;
export function UseInterceptors(...interceptors: (EggInterceptor | Function)[]): any;
export function UseFilters(...filters: (ExceptionFilter | Function)[]): any;

export function Controller(path?: string): (target: object) => any;
export function Resources(path: string): (target: object) => any;
export function Resources(name: string, path: string): (target: object) => any;
export function Restful(path: string): (target: object) => any;
export function Restful(name: string, path: string): (target: object) => any;


interface ArgumentMetadata {
  readonly type: Paramtype;
  readonly metatype?: new (...args) => any | undefined;
  readonly data?: string | undefined;
}

interface Type<T> extends Function {
  new(...args: any[]): T;
}

interface RouteInfo {
  readonly path: string;
  readonly method: RequestMethod;
}

interface ExecutionContext {
  getClass<T = any>(): Type<T>;  // use for class 
  getHandler(): Function;    // classMethod 
}

interface IMiddleware {
  apply(...middleware: (Function | any)[]): this;
  forRoutes(...routes: (string | RouteInfo | object)[]): this;
  exclude(...routes: Array<string | RouteInfo>): this;
}

export abstract class CanActivate extends BaseContextClass {
  constructor(...args: any[]): any;
  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}

export abstract class EggInterceptor<T = any, R = any> extends BaseContextClass {
  constructor(...args: any[]): any;
  abstract intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<R> | Promise<Observable<R>>;
}

export abstract class PipeTransform<T = any, R = any> extends BaseContextClass {
  constructor(...args: any[]): any;
  abstract transform(value: T, metadata: ArgumentMetadata): R;
}

export abstract class ExceptionFilter extends BaseContextClass {
  constructor(...args: any[]): any;
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


interface ValidatorOptions {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  groups?: string[];
  dismissDefaultMessages?: boolean;
  validationError?: {
    target?: boolean;
    value?: boolean;
  };
  forbidUnknownValues?: boolean;
}

interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
}


export class ParseIntPipe extends PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number>;
}

export class ValidationPipe extends PipeTransform {
  constructor(options?: ValidationPipeOptions);
  public async transform(value, metadata: ArgumentMetadata): any;
  private toValidate(metadata: ArgumentMetadata): boolean;
  toEmptyIfNil<T = any, R = any>(value: T): R | {};
}

export class ClassSerializerInterceptor extends EggInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any>;
}

export abstract class RestController extends BaseContextClass {
  // get  /posts/new
  new(...params: any[]): Promise<any>;
  // get  /posts
  index(...params: any[]): Promise<any>;
  // get /posts/:id 
  show(...params: any[]): Promise<any>;
  // get /posts/:id/edit
  edit(...params: any[]): Promise<any>;
  //  post /posts
  create(...params: any[]): Promise<any>;
  // patch /posts/:id
  update(...params: any[]): Promise<any>;
  // delete /posts/:id
  destroy(...params: any[]): Promise<any>
}
