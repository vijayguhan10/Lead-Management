import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class TelecallerClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost', 
        port: 8001, 
      },
    });
  }

  async validateTelecaller(telecallerId: string) {
    try {
      const result = await this.client
        .send({ cmd: 'validate_telecaller' }, telecallerId)
        .toPromise();
        console.log('Telecaller validation result:', result);
      return result;
    } catch (error) {
      console.error('Error validating telecaller:', error.message);
      return { isValid: false, error: 'Telecaller service unavailable' };
    }
  }

  async assignLead(leadId: string, telecallerId: string) {
    try {
      return await this.client
        .send({ cmd: 'assign_lead' }, { leadId, telecallerId })
        .toPromise();
    } catch (error) {
      console.error('Error assigning lead to telecaller:', error.message);
      return { success: false, error: 'Telecaller service unavailable' };
    }
  }

  async getTelecallerLeads(telecallerId: string) {
    try {
      return await this.client
        .send({ cmd: 'get_telecaller_leads' }, telecallerId)
        .toPromise();
    } catch (error) {
      console.error('Error getting telecaller leads:', error.message);
      return { success: false, error: 'Telecaller service unavailable' };
    }
  }
}
