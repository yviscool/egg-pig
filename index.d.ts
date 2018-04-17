declare module 'egg-pig' {
	export function Guard() : (target) => void;
	export function Pipe() : (target) => void;
	export function Interceptor() : (target) => void;
	export function Context(data?, ...pipes) : (target, key, index) => void;
	export function Request(data?, ...pipes) : (target, key, index) => void;
	export function Response(data?, ...pipes) : (target, key, index) => void;
	export function Body(data?, ...pipes) : (target, key, index) => void;
	export function Param(data?, ...pipes) : (target, key, index) => void;
	export function Query(data?, ...pipes) : (target, key, index) => void;
	export function UseGuards(...pipes:any[]) : (target, key?, descriptor?) => any;
	export function UsePipes(...pipes:any[]) : (target, key?, descriptor?) => any;
}