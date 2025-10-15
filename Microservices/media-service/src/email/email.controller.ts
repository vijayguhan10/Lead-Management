import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a test email to verify SMTP configuration
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async sendTestEmail(@Body('to') to: string): Promise<any> {
    try {
      if (!to) {
        return {
          success: false,
          message: 'Email address is required in request body: { "to": "email@example.com" }',
        };
      }

      await this.emailService.sendTestEmail(to);

      return {
        success: true,
        message: `Test email sent successfully to ${to}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send test email: ${error.message}`,
        error: error.stack,
      };
    }
  }

  /**
   * Verify email server connection
   */
  @Get('verify')
  async verifyConnection(): Promise<any> {
    try {
      const isConnected = await this.emailService.verifyConnection();

      return {
        success: isConnected,
        message: isConnected
          ? 'Email server connection verified successfully'
          : 'Email server connection failed',
      };
    } catch (error) {
      return {
        success: false,
        message: `Email server verification failed: ${error.message}`,
      };
    }
  }
}
