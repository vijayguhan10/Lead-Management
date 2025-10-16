import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Lead } from './interfaces/lead.interface';

@Injectable()
export class LeadClient {
  private readonly logger = new Logger(LeadClient.name);
  private client: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('LEAD_SERVICE_HOST', 'localhost');
    const port = Number(this.configService.get<string>('LEAD_SERVICE_TCP_PORT', '8003'));

    this.logger.log(`Lead Client initialized with TCP: ${host}:${port}`);

    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    });
  }

  /**
   * Get a single lead by ID
   */
  async getLeadById(leadId: string): Promise<Lead> {
    try {
      const lead = await firstValueFrom(
        this.client.send<Lead>({ cmd: 'get_lead_by_id' }, leadId),
      );
      return lead;
    } catch (error: any) {
      this.logger.error(`Failed to fetch lead ${leadId}`, error.message);
      throw new HttpException(
        `Failed to fetch lead: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get leads with upcoming follow-ups within a specific time window
   * @param startTime - Start of the time window
   * @param endTime - End of the time window
   */
  async getLeadsWithUpcomingFollowUps(
    startTime: Date,
    endTime: Date,
  ): Promise<Lead[]> {
    try {
      const leads = await firstValueFrom(
        this.client.send<Lead[]>(
          { cmd: 'get_upcoming_followups' },
          {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        ),
      );

      // Additional filtering on client side to ensure accuracy
      const filteredLeads = leads.filter((lead: Lead) => {
        if (!lead.nextFollowUp || !lead.assignedTo) return false;
        
        const followUpTime = new Date(lead.nextFollowUp);
        return followUpTime >= startTime && followUpTime <= endTime;
      });

      this.logger.log(
        `Found ${filteredLeads.length} leads with follow-ups between ${startTime.toISOString()} and ${endTime.toISOString()}`,
      );

      return filteredLeads;
    } catch (error: any) {
      this.logger.error('Failed to fetch leads with upcoming follow-ups', error.message);
      throw new HttpException(
        `Failed to fetch leads with upcoming follow-ups: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all leads for a specific organization
   */
  async getOrganizationLeads(organizationId: string): Promise<Lead[]> {
    try {
      const leads = await firstValueFrom(
        this.client.send<Lead[]>(
          { cmd: 'get_organization_leads' },
          organizationId,
        ),
      );
      return leads;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch leads for organization ${organizationId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch organization leads: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get leads assigned to a specific telecaller
   */
  async getLeadsByTelecaller(telecallerId: string): Promise<Lead[]> {
    try {
      const leads = await firstValueFrom(
        this.client.send<Lead[]>(
          { cmd: 'get_telecaller_leads' },
          telecallerId,
        ),
      );
      return leads;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch leads for telecaller ${telecallerId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller leads: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update lead's last contacted time
   */
  async updateLeadLastContacted(leadId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.client.send<void>(
          { cmd: 'update_lead_last_contacted' },
          { leadId, lastContacted: new Date() },
        ),
      );
      this.logger.log(`Updated last contacted time for lead ${leadId}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to update last contacted for lead ${leadId}`,
        error.message,
      );
      // Don't throw error here as this is not critical
    }
  }

  /**
   * Health check for lead service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.client.send<{ status: string }>({ cmd: 'health_check' }, {}),
      );
      return result.status === 'ok';
    } catch (error: any) {
      this.logger.error('Lead service health check failed', error.message);
      return false;
    }
  }
}
