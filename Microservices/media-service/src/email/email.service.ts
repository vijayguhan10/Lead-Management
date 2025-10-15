import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailConfig, EmailOptions } from './interfaces/email.interface';
import { SendFollowUpEmailDto } from './dto/send-follow-up-email.dto';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    this.emailConfig = {
      host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER', ''),
        pass: this.configService.get<string>('EMAIL_PASSWORD', ''),
      },
      from: {
        name: this.configService.get<string>('EMAIL_FROM_NAME', 'Lead Management System'),
        address: this.configService.get<string>('EMAIL_FROM_ADDRESS', 'noreply@leadmanagement.com'),
      },
    };

    this.initializeTransporter();
  }

  /**
   * Initialize the nodemailer transporter
   */
  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.emailConfig.host,
        port: this.emailConfig.port,
        secure: this.emailConfig.secure,
        auth: {
          user: this.emailConfig.auth.user,
          pass: this.emailConfig.auth.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email transporter', error.stack);
      throw error;
    }
  }

  /**
   * Verify email configuration and connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email server connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email server connection verification failed', error.stack);
      return false;
    }
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${this.emailConfig.from.name}" <${this.emailConfig.from.address}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${mailOptions.to}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error.stack);
      throw error;
    }
  }

  /**
   * Send follow-up reminder email to telecaller
   */
  async sendFollowUpReminder(dto: SendFollowUpEmailDto): Promise<void> {
    try {
      const subject = this.getFollowUpSubject(dto);
      const html = this.emailTemplateService.generateFollowUpReminderTemplate(dto);
      const text = this.emailTemplateService.generateFollowUpReminderText(dto);

      await this.sendEmail({
        to: dto.telecallerEmail,
        subject,
        html,
        text,
      });

      this.logger.log(
        `Follow-up reminder sent to ${dto.telecallerEmail} for lead ${dto.leadName} (${dto.notificationType})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send follow-up reminder to ${dto.telecallerEmail} for lead ${dto.leadName}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate subject line for follow-up emails
   */
  private getFollowUpSubject(dto: SendFollowUpEmailDto): string {
    const timeframe = dto.notificationType === 'ONE_HOUR' ? '1 Hour' : '30 Minutes';
    const priority = dto.leadPriority ? `[${dto.leadPriority} Priority] ` : '';
    return `${priority}Upcoming Follow-up in ${timeframe} - ${dto.leadName}`;
  }

  /**
   * Send bulk follow-up reminders
   */
  async sendBulkFollowUpReminders(reminders: SendFollowUpEmailDto[]): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ email: string; error: string }>;
  }> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    for (const reminder of reminders) {
      try {
        await this.sendFollowUpReminder(reminder);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: reminder.telecallerEmail,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Bulk follow-up reminders completed. Successful: ${results.successful}, Failed: ${results.failed}`,
    );

    return results;
  }

  /**
   * Send test email to verify configuration
   */
  async sendTestEmail(to: string): Promise<void> {
    const subject = 'Test Email - Lead Management System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Configuration Test</h2>
        <p>This is a test email from the Lead Management System.</p>
        <p>If you receive this email, your email configuration is working correctly.</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          Sent at: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
      text: 'This is a test email from the Lead Management System.',
    });
  }
}
