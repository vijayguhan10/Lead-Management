import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
  ValidateNested,
  IsPhoneNumber,
  IsEmail,
  MaxLength,
} from 'class-validator';

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

export class LeadDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  source: string;

  @IsString()
  organizationId?: string;

  @IsEnum(LeadPriority)
  @IsOptional()
  priority?: LeadPriority = LeadPriority.Low;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus = LeadStatus.New;

  @IsString()
  assignedTo: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastContacted?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextFollowUp?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestedIn?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  @IsNumber()
  conversionScore?: number;
}
