import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TelecallerDocument = Telecaller & Document;

@Schema()
class PerformanceMetrics {
  @Prop({ required: true })
  dailyCallTarget: number;

  @Prop({ required: true })
  monthlyLeadGoal: number;
}

const PerformanceMetricsSchema =
  SchemaFactory.createForClass(PerformanceMetrics);

@Schema({ timestamps: true })
export class Telecaller {
  @Prop()
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], default: [] })
  assignedLeads: string[];

  @Prop({ type: PerformanceMetricsSchema, required: true })
  performanceMetrics: PerformanceMetrics;
}

export const TelecallerSchema = SchemaFactory.createForClass(Telecaller);
