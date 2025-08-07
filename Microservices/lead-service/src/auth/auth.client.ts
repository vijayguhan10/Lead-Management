import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AuthClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost', // Change if your auth service runs elsewhere
        port: 8002, // Change to your auth service port
      },
    });
  }

  async validateToken(token: string) {
    return this.client.send({ cmd: 'validate_token' }, token).toPromise();
  }

  async checkRole(userId: string, requiredRoles: string[]) {
    return this.client
      .send({ cmd: 'check_role' }, { userId, requiredRoles })
      .toPromise();
  }
}
