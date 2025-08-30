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
    console.log("transport layer : ",Transport.TCP);
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8006,
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

  async smartAssignLeads(leadIds: string[], options?: { organizationId?: string }) {
    try {
      const payload = { leadIds, organizationId: options?.organizationId };
      return await this.client
        .send({ cmd: 'smart_assign_leads' }, payload)
        .toPromise();
    } catch (error) {
      console.error('Error in smart lead assignment:', error.message);
      return { success: false, error: 'Telecaller service unavailable' };
    }
  }
}
