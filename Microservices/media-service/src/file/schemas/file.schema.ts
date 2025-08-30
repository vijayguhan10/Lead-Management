import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  leadId: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ required: true })
  s3Key: string;

  @Prop({ required: true })
  s3Bucket: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  metadata?: Record<string, any>;
}

export const FileSchema = SchemaFactory.createForClass(File);
