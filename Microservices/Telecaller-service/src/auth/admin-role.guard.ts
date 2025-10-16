import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip authentication for RPC/TCP microservice calls (internal service-to-service)
    const contextType = context.getType();
    if (contextType === 'rpc') {
      return true; // Allow internal microservice calls without authentication
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.userId)
      throw new ForbiddenException('User not authenticated');
    const result = await this.authClient.validateUser(user.userId);
    if (!result.isValid || !result.isActive)
      throw new ForbiddenException('Invalid or inactive user');
    if (result.role !== 'superadmin')
      throw new ForbiddenException('Only admin can access this resource');
    return true;
  }
}
