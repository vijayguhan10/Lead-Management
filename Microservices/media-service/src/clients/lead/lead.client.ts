import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Lead } from './interfaces/lead.interface';

@Injectable()
export class LeadClient {
  private readonly logger = new Logger(LeadClient.name);
  private readonly leadServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.leadServiceUrl = this.configService.get<string>(
      'LEAD_SERVICE_URL',
      'http://localhost:3003',
    );

    this.logger.log(`Lead Client initialized with URL: ${this.leadServiceUrl}`);
  }

  /**
   * Get a single lead by ID
   */
  async getLeadById(leadId: string): Promise<Lead> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Lead>(`${this.leadServiceUrl}/leads/${leadId}`),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch lead ${leadId}`, error.message);
      throw new HttpException(
        `Failed to fetch lead: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
      // Use internal endpoint that doesn't require authentication
      const response: AxiosResponse<Lead[]> = await firstValueFrom(
        this.httpService.get<Lead[]>(`${this.leadServiceUrl}/internal/leads/upcoming-followups`, {
          params: {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }),
      );

      const leads = response.data;

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
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all leads for a specific organization
   */
  async getOrganizationLeads(organizationId: string): Promise<Lead[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Lead[]>(
          `${this.leadServiceUrl}/leads/getOrganizationLeads/${organizationId}`,
        ),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch leads for organization ${organizationId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch organization leads: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get leads assigned to a specific telecaller
   */
  async getLeadsByTelecaller(telecallerId: string): Promise<Lead[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Lead[]>(`${this.leadServiceUrl}/leads`, {
          params: {
            assignedTo: telecallerId,
          },
        }),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch leads for telecaller ${telecallerId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller leads: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update lead's last contacted time
   */
  async updateLeadLastContacted(leadId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.put(`${this.leadServiceUrl}/leads/${leadId}`, {
          lastContacted: new Date(),
        }),
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
      const response = await firstValueFrom(
        this.httpService.get<{ status: string }>(`${this.leadServiceUrl}/health`),
      );
      return response.status === 200;
    } catch (error: any) {
      this.logger.error('Lead service health check failed', error.message);
      return false;
    }
  }
}
