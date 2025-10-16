import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { FollowUpSchedulerService } from './follow-up-scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { NotificationLog, NotificationLogSchema } from './schemas/notification-log.schema';
import { LeadClient } from '../clients/lead/lead.client';
import { TelecallerClient } from '../clients/telecaller/telecaller.client';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: NotificationLog.name, schema: NotificationLogSchema },
    ]),
    EmailModule,
  ],
  providers: [FollowUpSchedulerService, LeadClient, TelecallerClient],
  controllers: [SchedulerController],
  exports: [FollowUpSchedulerService],
})
export class SchedulerModule {}
