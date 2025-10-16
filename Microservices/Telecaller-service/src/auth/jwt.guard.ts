import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip authentication for RPC/TCP microservice calls (internal service-to-service)
    const contextType = context.getType();
    if (contextType === 'rpc') {
      return true; // Allow internal microservice calls without authentication
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];
    const result = await this.authClient.validateToken(token);
    console.log('Token Validation Result:', result);
    console.log('Token Validation Result:', result);
    if (!result.isValid) {
      throw new UnauthorizedException(result.error || 'Invalid token');
    }
    
    request.user = result.user;
    return true;
  }
}
