import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TelecallerDocument = Telecaller & Document;

@Schema()
class PerformanceMetrics {
  @Prop()
  dailyCallTarget?: number;

  @Prop()
  monthlyLeadGoal?: number;
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

  @Prop({ type: PerformanceMetricsSchema, required: false })
  performanceMetrics?: PerformanceMetrics;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId?: mongoose.Schema.Types.ObjectId;
}

export const TelecallerSchema = SchemaFactory.createForClass(Telecaller);
