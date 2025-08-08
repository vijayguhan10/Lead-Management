import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  phoneNumber?: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, enum: ['superadmin', 'admin', 'telecaller'] })
  role: string;

  @Prop()
  organizationId?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
