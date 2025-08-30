import { IsString, IsOptional, IsArray, IsObject, IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  leadId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetSignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsNotEmpty()
  leadId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
