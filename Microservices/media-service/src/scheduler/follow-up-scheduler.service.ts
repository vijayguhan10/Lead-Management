import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadClient } from '../clients/lead/lead.client';
import { TelecallerClient } from '../clients/telecaller/telecaller.client';
import { EmailService } from '../email/email.service';
import {
  NotificationLog,
  NotificationLogDocument,
  NotificationType,
  NotificationStatus,
} from './schemas/notification-log.schema';
import { SendFollowUpEmailDto } from '../email/dto/send-follow-up-email.dto';

@Injectable()
export class FollowUpSchedulerService {
  private readonly logger = new Logger(FollowUpSchedulerService.name);
  private isProcessing = false;

  constructor(
    @InjectModel(NotificationLog.name)
    private readonly notificationLogModel: Model<NotificationLogDocument>,
    private readonly leadClient: LeadClient,
    private readonly telecallerClient: TelecallerClient,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Cron job that runs every 5 minutes to check for upcoming follow-ups
   * and send email notifications
   */
  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'check-follow-up-notifications',
  })
  async handleFollowUpNotifications(): Promise<void> {
    if (this.isProcessing) {
      this.logger.warn('Previous notification check still in progress, skipping');
      return;
    }

    this.isProcessing = true;
    this.logger.log('Starting follow-up notification check');

    try {
      const now = new Date();

      // Check for 1-hour notifications
      await this.processNotifications(now, 60, NotificationType.ONE_HOUR);

      // Check for 30-minute notifications
      await this.processNotifications(now, 30, NotificationType.THIRTY_MINUTES);

      this.logger.log('Follow-up notification check completed successfully');
    } catch (error) {
      this.logger.error('Error during follow-up notification check', error.stack);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process notifications for a specific time window
   * @param now - Current time
   * @param minutesBeforeFollowUp - Minutes before follow-up (60 or 30)
   * @param notificationType - Type of notification
   */
  private async processNotifications(
    now: Date,
    minutesBeforeFollowUp: number,
    notificationType: NotificationType,
  ): Promise<void> {
    try {
      // Calculate the target time window (e.g., 60 minutes from now ±2.5 minutes)
      const targetTime = new Date(now.getTime() + minutesBeforeFollowUp * 60 * 1000);
      const windowStart = new Date(targetTime.getTime() - 2.5 * 60 * 1000);
      const windowEnd = new Date(targetTime.getTime() + 2.5 * 60 * 1000);

      // Get leads with follow-ups in this time window
      const leads = await this.leadClient.getLeadsWithUpcomingFollowUps(
        windowStart,
        windowEnd,
      );

      this.logger.log(
        `Found ${leads.length} leads requiring ${notificationType} notification`,
      );

      // Process each lead
      for (const lead of leads) {
        try {
          await this.processLeadNotification(lead, notificationType);
        } catch (error) {
          this.logger.error(
            `Failed to process notification for lead ${lead._id}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error processing ${notificationType} notifications`,
        error.stack,
      );
    }
  }

  /**
   * Process notification for a single lead
   */
  private async processLeadNotification(
    lead: any,
    notificationType: NotificationType,
  ): Promise<void> {
    try {
      // Check if notification already exists
      const existingNotification = await this.notificationLogModel
        .findOne({
          leadId: lead._id,
          notificationType,
        })
        .exec();

      if (existingNotification) {
        if (existingNotification.status === NotificationStatus.SENT) {
          this.logger.debug(
            `Notification already sent for lead ${lead._id} (${notificationType})`,
          );
          return;
        }

        if (existingNotification.status === NotificationStatus.FAILED &&
            existingNotification.retryCount >= 3) {
          this.logger.warn(
            `Maximum retry attempts reached for lead ${lead._id} (${notificationType})`,
          );
          return;
        }
      }

      // Get telecaller information
      const telecaller = await this.telecallerClient.getTelecallerById(
        lead.assignedTo,
      );

      if (!telecaller || !telecaller.email) {
        this.logger.warn(
          `Telecaller ${lead.assignedTo} not found or has no email`,
        );
        await this.logNotificationFailure(
          lead,
          notificationType,
          'Telecaller not found or has no email',
          existingNotification,
        );
        return;
      }

      // Prepare email data
      const emailDto: SendFollowUpEmailDto = {
        telecallerEmail: telecaller.email,
        telecallerName: telecaller.name,
        leadId: lead._id,
        leadName: lead.name,
        leadPhone: lead.phone,
        leadEmail: lead.email,
        leadCompany: lead.company,
        leadPosition: lead.position,
        leadSource: lead.source,
        leadStatus: lead.status,
        leadPriority: lead.priority,
        nextFollowUp: new Date(lead.nextFollowUp).toISOString(),
        notes: lead.notes,
        interestedIn: lead.interestedIn,
        tags: lead.tags,
        notificationType,
      };

      // Send email
      await this.emailService.sendFollowUpReminder(emailDto);

      // Log successful notification
      await this.logNotificationSuccess(lead, notificationType, telecaller.email, existingNotification);

      this.logger.log(
        `Successfully sent ${notificationType} notification for lead ${lead._id} to ${telecaller.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing lead notification for ${lead._id}`,
        error.stack,
      );
      await this.logNotificationFailure(lead, notificationType, error.message, null);
    }
  }

  /**
   * Log successful notification
   */
  private async logNotificationSuccess(
    lead: any,
    notificationType: NotificationType,
    telecallerEmail: string,
    existingNotification: NotificationLogDocument | null,
  ): Promise<void> {
    const now = new Date();

    if (existingNotification) {
      existingNotification.status = NotificationStatus.SENT;
      existingNotification.sentAt = now;
      existingNotification.errorMessage = undefined;
      await existingNotification.save();
    } else {
      const notificationLog = new this.notificationLogModel({
        leadId: lead._id,
        telecallerId: lead.assignedTo,
        telecallerEmail,
        followUpTime: lead.nextFollowUp,
        notificationType,
        status: NotificationStatus.SENT,
        scheduledSendTime: now,
        sentAt: now,
      });
      await notificationLog.save();
    }
  }

  /**
   * Log failed notification
   */
  private async logNotificationFailure(
    lead: any,
    notificationType: NotificationType,
    errorMessage: string,
    existingNotification: NotificationLogDocument | null,
  ): Promise<void> {
    const now = new Date();

    if (existingNotification) {
      existingNotification.status = NotificationStatus.FAILED;
      existingNotification.errorMessage = errorMessage;
      existingNotification.retryCount += 1;
      await existingNotification.save();
    } else {
      const notificationLog = new this.notificationLogModel({
        leadId: lead._id,
        telecallerId: lead.assignedTo,
        telecallerEmail: 'unknown',
        followUpTime: lead.nextFollowUp,
        notificationType,
        status: NotificationStatus.FAILED,
        scheduledSendTime: now,
        errorMessage,
        retryCount: 1,
      });
      await notificationLog.save();
    }
  }

  /**
   * Manually trigger notification check (for testing)
   */
  async triggerManualCheck(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.handleFollowUpNotifications();
      return {
        success: true,
        message: 'Manual notification check completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Manual notification check failed: ${error.message}`,
      };
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = {};

    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }
    if (endDate) {
      filter.createdAt = { ...filter.createdAt, $lte: endDate };
    }

    const [total, sent, failed, pending] = await Promise.all([
      this.notificationLogModel.countDocuments(filter),
      this.notificationLogModel.countDocuments({
        ...filter,
        status: NotificationStatus.SENT,
      }),
      this.notificationLogModel.countDocuments({
        ...filter,
        status: NotificationStatus.FAILED,
      }),
      this.notificationLogModel.countDocuments({
        ...filter,
        status: NotificationStatus.PENDING,
      }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? ((sent / total) * 100).toFixed(2) + '%' : '0%',
    };
  }
}
