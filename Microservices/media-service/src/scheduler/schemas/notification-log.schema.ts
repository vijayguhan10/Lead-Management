import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationLogDocument = NotificationLog & Document;

export enum NotificationType {
  ONE_HOUR = 'ONE_HOUR',
  THIRTY_MINUTES = 'THIRTY_MINUTES',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  leadId: string;

  @Prop({ required: true })
  telecallerId: string;

  @Prop({ required: true })
  telecallerEmail: string;

  @Prop({ required: true, type: Date })
  followUpTime: Date;

  @Prop({
    required: true,
    enum: Object.values(NotificationType),
    type: String,
  })
  notificationType: NotificationType;

  @Prop({
    required: true,
    enum: Object.values(NotificationStatus),
    type: String,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Prop({ required: true, type: Date })
  scheduledSendTime: Date;

  @Prop({ type: Date })
  sentAt?: Date;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Number, default: 0 })
  retryCount: number;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);

// Create indexes for efficient querying
NotificationLogSchema.index({ leadId: 1, notificationType: 1 }, { unique: true });
NotificationLogSchema.index({ status: 1, scheduledSendTime: 1 });
NotificationLogSchema.index({ telecallerId: 1 });
NotificationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL: 30 days
