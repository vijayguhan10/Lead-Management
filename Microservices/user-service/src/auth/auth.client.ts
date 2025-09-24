import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'auth-service.lead.microservices.local',
        port: 8001, // auth-service TCP port
      },
    });
  }

  async createUser(user: any) {
    return this.client.send({ cmd: 'create_user' }, user).toPromise();
  }

  async validateUser(userId: string) {
    return this.client.send({ cmd: 'validate_user' }, userId).toPromise();
  }

  async validateToken(token: string) {
    return this.client.send({ cmd: 'validate_token' }, token).toPromise();
  }
}
