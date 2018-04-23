export function Guard(): any;
export function Pipe(): any;
export function Interceptor(): any;

export function Context(data?, ...pipes): any;
export function Request(data?, ...pipes): any;
export function Response(data?, ...pipes): any;
export function Param(data?, ...pipes): any;
export function Query(data?, ...pipes): any;
export function Body(data?, ...pipes): any;
export function Session(data?, ...pipes): any;
export function Headers(data?, ...pipes): any;

export function Head(path?): any;
export function Get(path?): any;
export function Post(path?): any;
export function Delete(path?): any;
export function Options(path?): any;
export function Put(path?): any;
export function Patch(path?): any;

export function UsePipes(...pipes): any;
export function UseGuards(...pipes): any;
export function UseInterceptors(...pipes): any;

export function Controller(path?): any;
export function Resources(path?): any;
