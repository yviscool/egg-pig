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

export function UsePipes(...pipes): any;
export function UseGuards(...pipes): any;
export function UseInterceptors(...pipes): any;
