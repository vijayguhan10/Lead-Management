import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    console.log('User from request:', user);
    if (!user || !user.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const result = await this.authClient.validateUser(user.userId);

    if (!result.isValid) {
      throw new ForbiddenException('Invalid user');
    }

    if (!result.isActive) {
      throw new ForbiddenException('User account is not active');
    }

    if (result.role !== 'telecaller') {
      throw new ForbiddenException('Only telecallers can access this resource');
    }

    return true;
  }
}
