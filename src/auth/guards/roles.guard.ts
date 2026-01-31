import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthenticatedRequest {
  user?: {
    role: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      this.logger.warn('RolesGuard: No user found in request');
      throw new ForbiddenException('No user found');
    }

    if (!user.role) {
      this.logger.warn('RolesGuard: User has no role assigned');
      throw new ForbiddenException('User has no role');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      this.logger.warn(
        `RolesGuard: User with role '${user.role}' attempted unauthorized access`,
      );
      throw new ForbiddenException(
        `This action requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}