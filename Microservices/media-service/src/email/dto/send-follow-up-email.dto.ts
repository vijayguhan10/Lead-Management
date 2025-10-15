import { IsEmail, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class SendFollowUpEmailDto {
  @IsEmail()
  @IsNotEmpty()
  telecallerEmail: string;

  @IsString()
  @IsNotEmpty()
  telecallerName: string;

  @IsString()
  @IsNotEmpty()
  leadId: string;

  @IsString()
  @IsNotEmpty()
  leadName: string;

  @IsString()
  @IsNotEmpty()
  leadPhone: string;

  @IsEmail()
  @IsOptional()
  leadEmail?: string;

  @IsString()
  @IsOptional()
  leadCompany?: string;

  @IsString()
  @IsOptional()
  leadPosition?: string;

  @IsString()
  @IsOptional()
  leadSource?: string;

  @IsString()
  @IsOptional()
  leadStatus?: string;

  @IsString()
  @IsOptional()
  leadPriority?: string;

  @IsDateString()
  @IsNotEmpty()
  nextFollowUp: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  interestedIn?: string[];

  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  notificationType: 'ONE_HOUR' | 'THIRTY_MINUTES';
}
