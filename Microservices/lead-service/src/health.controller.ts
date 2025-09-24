import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  getHealth() {
    console.log('Health check requested');
    return { status: 'ok' };
  }
}
