import { Controller, Get, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './schema/lead.schema';

/**
 * Internal Lead Controller
 * For inter-service communication without authentication
 * Used by media-service for email notifications
 */
@Controller('internal/leads')
export class LeadInternalController {
  constructor(private readonly leadService: LeadService) {}

  /**
   * Get leads with upcoming follow-ups within a time range
   * This endpoint is used by the media-service scheduler
   * No authentication required for internal service calls
   */
  @Get('upcoming-followups')
  async getLeadsWithUpcomingFollowUps(@Query() query: any): Promise<Lead[]> {
    const { startTime, endTime } = query;
    
    if (!startTime || !endTime) {
      return [];
    }
    
    return this.leadService.findLeadsWithUpcomingFollowUps(
      new Date(startTime),
      new Date(endTime)
    );
  }

  /**
   * Health check endpoint for internal monitoring
   */
  @Get('health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
