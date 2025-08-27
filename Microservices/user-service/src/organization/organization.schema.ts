import { Schema, Document, model, Types } from 'mongoose';


export interface ITelecaller {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'not available';
  performanceMetrics?: {
    dailyCallTarget?: number;
    monthlyLeadGoal?: number;
  };
}

export interface IOrganization extends Document {
  orgName: string;
  orgAddress: string;
  admin: {
    name: string;
    email: string;
    phone: string;
  };
  telecallers: ITelecaller[];
  exotel: {
    virtualNumbers: number;
    balance: string;
    callVolume: string;
    activeNumbers: number;
    callDuration: string;
  };
  whatsapp: {
    numbers: number;
    messageVolume: string;
  };
  cloud: {
    totalStorage: string;
    defaultStorage: string;
    storageUrl: string;
  };
  plan: 'Starter' | 'Standard' | 'Premium' | 'Enterprise';
  createdAt: Date;
  deleted: boolean;
}

const TelecallerSchema = new Schema<ITelecaller>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Auth' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['available', 'not available'], default: 'available' },
  performanceMetrics: {
    dailyCallTarget: { type: Number, required: false },
    monthlyLeadGoal: { type: Number, required: false },
  },
}, { _id: false });

const OrganizationSchema = new Schema<IOrganization>({
  orgName: { type: String, required: true },
  orgAddress: { type: String, required: true },
  admin: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  telecallers: { type: [TelecallerSchema], default: [] },
  exotel: {
    virtualNumbers: { type: Number, required: true },
    balance: { type: String, required: true },
    callVolume: { type: String, required: true },
    activeNumbers: { type: Number, required: true },
    callDuration: { type: String, required: true },
  },
  whatsapp: {
    numbers: { type: Number, required: true },
    messageVolume: { type: String, required: true },
  },
  cloud: {
    totalStorage: { type: String, required: true },
    defaultStorage: { type: String, required: true },
    storageUrl: { type: String, required: true },
  },
  plan: { type: String, enum: ['Starter', 'Standard', 'Premium', 'Enterprise'], required: true },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

export const OrganizationModel = model<IOrganization>('Organization', OrganizationSchema);
