import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['api-key']; // give the name you want

    if (!apiKey) {
      console.error('no api key');
      throw new UnauthorizedException('Access denied.');
    }

    // call your env. var the name you want
    if (apiKey !== process.env.API_KEY) {
      console.error('invalid api key');
      throw new UnauthorizedException('Access denied.');
    }

    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // if public decorator is set to true, then no need to check for roles
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // User is appended by AuthGuard

    if (!user) {
      return false;
    }

    // console.log(user.role, requiredRoles);

    console.log(
      'is role allowed?',
      requiredRoles.some((role) => user.role === role),
    );

    return requiredRoles.some((role) => user.role === role);
  }
}
