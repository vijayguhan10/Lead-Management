import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Missing authorization token');

    let validation;
    try {
      validation = await this.authClient.validateToken(token);
    } catch (err) {
      throw new UnauthorizedException('Token validation failed');
    }
    if (!validation || !validation.isValid || !validation.user)
      throw new UnauthorizedException('Invalid token');

    request.user = validation.user;
    const allowedRoles = ['telecaller', 'admin'];

    let roleCheck;
    try {
      roleCheck = await this.authClient.checkRole(
        request.user.id,
        allowedRoles,
      );
    } catch (err) {
      throw new UnauthorizedException('Role check failed');
    }
    if (!roleCheck || roleCheck.hasRole !== true)
      throw new UnauthorizedException('Insufficient role');

    return true;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];
    let result;
    try {
      result = await this.authClient.validateToken(token);
    } catch (err) {
      throw new UnauthorizedException('Token validation failed');
    }
    if (!result || !result.isValid || !result.user) {
      throw new UnauthorizedException(result?.error || 'Invalid token');
    }

    request.user = result.user;
    return true;
  }
}
@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Missing authorization token');

    let validation;
    try {
      validation = await this.authClient.validateToken(token);
    } catch (err) {
      throw new UnauthorizedException('Token validation failed');
    }
    if (!validation || !validation.isValid || !validation.user)
      throw new UnauthorizedException('Invalid token');

    request.user = validation.user;

    let roleCheck;
    try {
      roleCheck = await this.authClient.checkRole(request.user.id, ['admin']);
    } catch (err) {
      throw new UnauthorizedException('Role check failed');
    }
    if (!roleCheck || roleCheck.hasRole !== true)
      throw new UnauthorizedException('Admin role required');

    return true;
  }
}
