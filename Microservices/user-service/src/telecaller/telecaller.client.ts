import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class TelecallerClient {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'telecaller-service.lead.microservices.local',
        port: 8006, // telecaller-service TCP port
      },
    });
  }

  async createTelecaller(telecaller: any) {
    return this.client.send({ cmd: 'create_telecaller' }, telecaller).toPromise();
  }
}
