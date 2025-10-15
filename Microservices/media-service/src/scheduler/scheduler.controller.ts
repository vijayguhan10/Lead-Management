import { Controller, Get, Post, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { FollowUpSchedulerService } from './follow-up-scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly followUpSchedulerService: FollowUpSchedulerService,
  ) {}

  /**
   * Manually trigger notification check
   * Useful for testing and debugging
   */
  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  async triggerManualCheck(): Promise<any> {
    return this.followUpSchedulerService.triggerManualCheck();
  }

  /**
   * Get notification statistics
   */
  @Get('stats')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.followUpSchedulerService.getNotificationStats(start, end);
  }

  /**
   * Health check endpoint
   */
  @Get('health')
  async healthCheck(): Promise<any> {
    return {
      status: 'ok',
      service: 'follow-up-scheduler',
      timestamp: new Date().toISOString(),
    };
  }
}
