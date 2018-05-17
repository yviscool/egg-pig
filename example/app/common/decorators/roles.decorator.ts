import { ReflectMetadata } from 'egg-pig';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);
