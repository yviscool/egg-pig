import { Guard, CanActivate} from 'egg-pig';


@Guard()
export class RolesGuard extends CanActivate {

  canActivate(req, context){
    const { handler } = context;
    const roles = this.ctx.helper['reflector'].get('roles', handler);
    if (!roles) {
      return true;
    }
    const user = req.user;
    const hasRole = user.roles.some((role) => !!roles.find((item) => item === role));
    return user && user.roles && hasRole();
  }
}
