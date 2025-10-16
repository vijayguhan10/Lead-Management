import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Comprehensive email system test
   * Tests SMTP, DNS records, and sends actual email
   */
  @Post('test-comprehensive')
  @HttpCode(HttpStatus.OK)
  async comprehensiveTest(@Body('to') to: string): Promise<any> {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {},
      overall: 'pending',
    };

    try {
      if (!to) {
        return {
          success: false,
          message: 'Email address is required in request body: { "to": "your-email@example.com" }',
        };
      }

      // Test 1: SMTP Connection
      console.log('🔍 Testing SMTP connection...');
      try {
        const smtpConnected = await this.emailService.verifyConnection();
        results.tests.smtpConnection = {
          status: smtpConnected ? 'PASSED' : 'FAILED',
          message: smtpConnected 
            ? '✅ SMTP connection successful (smtp-relay.brevo.com:587)'
            : '❌ SMTP connection failed',
        };
      } catch (error) {
        results.tests.smtpConnection = {
          status: 'FAILED',
          message: `❌ SMTP error: ${error.message}`,
        };
      }

      // Test 2: Configuration Check
      console.log('🔍 Checking email configuration...');
      const config = await this.emailService.getEmailConfig();
      results.tests.configuration = {
        status: 'INFO',
        host: config.host,
        port: config.port,
        secure: config.secure,
        fromAddress: config.from,
        fromName: config.fromName,
      };

      // Test 3: Send Test Email
      console.log('🔍 Sending test email...');
      try {
        const emailResult = await this.emailService.sendTestEmail(to);
        results.tests.testEmail = {
          status: 'PASSED',
          message: `✅ Test email sent successfully to ${to}`,
          messageId: emailResult.messageId,
        };
      } catch (error) {
        results.tests.testEmail = {
          status: 'FAILED',
          message: `❌ Failed to send test email: ${error.message}`,
          error: error.stack,
        };
      }

      // Test 4: Send Follow-up Template Email
      console.log('🔍 Testing follow-up email template...');
      try {
        const templateResult = await this.emailService.sendFollowUpReminder({
          telecallerEmail: to,
          telecallerName: 'Test Telecaller',
          leadId: 'test-lead-123',
          leadName: 'John Doe (TEST)',
          leadEmail: 'john.doe@example.com',
          leadPhone: '+1234567890',
          leadCompany: 'Test Company Inc.',
          leadStatus: 'Interested',
          leadPriority: 'HIGH',
          nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          notificationType: 'ONE_HOUR',
        });
        results.tests.followUpTemplate = {
          status: 'PASSED',
          message: `✅ Follow-up reminder email sent successfully`,
          messageId: templateResult.messageId,
        };
      } catch (error) {
        results.tests.followUpTemplate = {
          status: 'FAILED',
          message: `❌ Failed to send follow-up email: ${error.message}`,
        };
      }

      // Determine overall status
      const failedTests = Object.values(results.tests).filter(
        (test: any) => test.status === 'FAILED'
      );
      
      results.overall = failedTests.length === 0 ? 'SUCCESS' : 'PARTIAL_FAILURE';
      results.summary = {
        total: Object.keys(results.tests).length,
        passed: Object.values(results.tests).filter((test: any) => test.status === 'PASSED').length,
        failed: failedTests.length,
      };

      return {
        success: results.overall === 'SUCCESS',
        message: results.overall === 'SUCCESS' 
          ? '🎉 All email tests passed! Check your inbox at ' + to
          : `⚠️ Some tests failed (${failedTests.length}/${results.summary.total})`,
        results,
      };

    } catch (error) {
      return {
        success: false,
        message: `Comprehensive test failed: ${error.message}`,
        error: error.stack,
        results,
      };
    }
  }

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

      const result = await this.emailService.sendTestEmail(to);

      return {
        success: true,
        message: `Test email sent successfully to ${to}`,
        messageId: result.messageId,
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

  /**
   * Get current email configuration (sanitized)
   */
  @Get('config')
  async getConfig(): Promise<any> {
    try {
      const config = await this.emailService.getEmailConfig();
      return {
        success: true,
        config,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get config: ${error.message}`,
      };
    }
  }
}
