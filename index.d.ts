
type ParamData = object | string | number;

export function Guard(): any;
export function Pipe(): any;
export function Interceptor(): any;

export function Context(): any;
export function Request(): any;
export function Response(): any;
export function Param(data?: ParamData, ...pipes): any;
export function Query(data?: ParamData, ...pipes): any;
export function Body(data?: ParamData, ...pipes): any;
export function Headers(data?: ParamData): any;
export function Session(): any;
export function UploadedFile(): any;
export function UploadedFiles(): any;

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


