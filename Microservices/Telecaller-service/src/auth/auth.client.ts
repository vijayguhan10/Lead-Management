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
        host: '127.0.0.1', 
        port: 8000,
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

  async validateUser(userId: string) {
    return this.client.send({ cmd: 'validate_user' }, userId).toPromise();
  }
}
