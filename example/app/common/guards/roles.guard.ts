import { Injectable, CanActivate, ExecutionContext } from 'egg-pig';


@Injectable()
export class RolesGuard extends CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const roles = this.ctx.helper['reflector'].get('roles', handler);
    if (!roles) {
      return true;
    }
    const user = this.ctx.req['user'];
    const hasRole = user.roles.some((role) => !!roles.find((item) => item === role));
    return user && user.roles && hasRole();
  }
}
