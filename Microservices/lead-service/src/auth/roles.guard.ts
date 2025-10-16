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
    // Skip authentication for RPC/TCP microservice calls (internal service-to-service)
    const contextType = context.getType();
    if (contextType === 'rpc') {
      return true; // Allow internal microservice calls without authentication
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Missing authorization token');

    let validation;
    try {
      validation = await this.authClient.validateToken(token);
      console.log('Token validation result:', validation);
    } catch (err) {
      console.error('Token validation failed:', err);
      throw new UnauthorizedException('Token validation failed');
    }
    if (!validation?.isValid || !validation.user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = validation.user;
    const allowedRoles = ['telecaller', 'admin'];

    let roleCheck;
    try {
      roleCheck = await this.authClient.checkRole(
        request.user.userId,
        allowedRoles,
      );
      console.log('Role check result:', roleCheck);
    } catch (err) {
      console.error('Role check failed:', err);
      throw new UnauthorizedException('Role check failed');
    }
    if (!roleCheck?.hasRole) {
      throw new UnauthorizedException(roleCheck?.error || 'Insufficient role');
    }

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
      console.log('Token validation result:', validation);
    } catch (err) {
      console.error('Token validation failed:', err);
      throw new UnauthorizedException('Token validation failed');
    }
    if (!validation?.isValid || !validation.user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = validation.user;

    let roleCheck;
    try {
      roleCheck = await this.authClient.checkRole(request.user.userId, [
        'admin',
      ]);
      console.log('Role check result:', roleCheck);
    } catch (err) {
      console.error('Role check failed:', err);
      throw new UnauthorizedException('Role check failed');
    }
    if (!roleCheck?.hasRole) {
      throw new UnauthorizedException(
        roleCheck?.error || 'Admin role required',
      );
    }

    return true;
  }
}
