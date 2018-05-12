import { BaseContextClass, Request } from 'egg';
import { Observable } from 'rxjs';

type ParamData = object | string | number;

type Paramtype = 'BODY' | 'QUERY' | 'PARAM' | 'CUSTOM';

export function Guard(): any;
export function Pipe(): any;
export function Interceptor(): any;

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
export function Post(name?: string, path?: string): any;
export function Delete(name?: string, path?: string): any;
export function Options(name?: string, path?: string): any;
export function Put(name?: string, path?: string): any;
export function Patch(name?: string, path?: string): any;

export function Render(template: string): any;
export function Header(name: string, value: string): any;

export function UsePipes(...pipes): any;
export function UseGuards(...pipes): any;
export function UseInterceptors(...pipes): any;

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

export abstract class CanActivate extends BaseContextClass {
  abstract canActivate(
    req: Request,
    context: any,
  ): boolean | Promise<boolean>;
}

export abstract class EgggInterceptor extends BaseContextClass{
  abstract intercept(
    req: Request,
    context: any,
    call$: any,
  ): Observable | Promise<Observable>;
}

export abstract class PipeTransform extends BaseContextClass{
  abstract transform(value: any, metadata: ArgumentMetadata): any;
}

export function createParamDecorator( factory: (data, req) => any) : (data?: any, ...pipes) => any;
