import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

export enum LeadPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Converted = 'Converted',
  Dropped = 'Dropped',
}

@Schema()
class UtmParams {
  @Prop()
  source?: string;

  @Prop()
  medium?: string;

  @Prop()
  campaign?: string;
}

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  source: string;

  @Prop({
    type: String,
    enum: Object.values(LeadPriority),
    default: LeadPriority.Low,
  })
  priority: LeadPriority;

  @Prop({
    type: String,
    enum: Object.values(LeadStatus),
    default: LeadStatus.New,
  })
  status: LeadStatus;

  @Prop({ required: true })
  assignedTo: string;

  @Prop()
  email?: string;

  @Prop()
  alternatePhone?: string;

  @Prop()
  company?: string;

  @Prop()
  position?: string;

  @Prop()
  industry?: string;

  @Prop()
  location?: string;

  @Prop()
  pincode?: string;

  @Prop()
  notes?: string;

  @Prop()
  lastContacted?: Date;

  @Prop()
  nextFollowUp?: Date;

  @Prop([String])
  interestedIn?: string[];

  @Prop([String])
  tags?: string[];

  @Prop()
  createdBy?: string;

  @Prop([String])
  attachments?: string[];

  @Prop({ type: UtmParams })
  utmParams?: UtmParams;

  @Prop()
  conversionScore?: number;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
