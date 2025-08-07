import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class TelecallerRoleGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.userId)
      throw new ForbiddenException('User not authenticated');
    const result = await this.authClient.validateUser(user.userId);
    if (!result.isValid || !result.isActive)
      throw new ForbiddenException('Invalid or inactive user');
    if (result.role !== 'telecaller')
      throw new ForbiddenException('Only telecaller can access this resource');
    return true;
  }
}

@Injectable()
export class AdminAccessRoleGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.userId)
      throw new ForbiddenException('User not authenticated');
    const result = await this.authClient.validateUser(user.userId);
    if (!result.isValid || !result.isActive)
      throw new ForbiddenException('Invalid or inactive user');
    if (result.role !== 'admin')
      throw new ForbiddenException('Only admin can access this resource');
    return true;
  }
}
@Injectable()
export class TelecallerOrAdminGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const allowedRoles = ['telecaller', 'admin'];
    let roleCheck;
    try {
      roleCheck = await this.authClient.checkRole(request.user.userId, allowedRoles);
      console.log('Role check result:', roleCheck);
    } catch (err) {
      console.error('Role check error:', err);
      throw new UnauthorizedException('Role check failed');
    }
    if (!roleCheck?.hasRole) {
      console.error('Role check failed:', roleCheck?.error || 'Insufficient role');
      throw new UnauthorizedException(roleCheck?.error || 'Insufficient role');
    }
    return true;
  }
}