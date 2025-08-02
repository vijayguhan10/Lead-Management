import { Type } from 'class-transformer';
import { IsString, IsArray, IsObject, IsEmail, IsPhoneNumber, ValidateNested, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

class PerformanceMetricsDto {
  @IsNumber()
  @IsNotEmpty()
  dailyCallTarget: number;

  @IsNumber()
  @IsNotEmpty()
  monthlyLeadGoal: number;
}

export class TelecallerDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  assignedLeads: string[] = [];

  @IsObject()
  @ValidateNested()
  @Type(() => PerformanceMetricsDto)
  performanceMetrics: PerformanceMetricsDto;
}