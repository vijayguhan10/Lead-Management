import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  IsEnum,
} from 'class-validator';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  TELECALLER = 'telecaller',
}

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsPhoneNumber()
  @MinLength(11)
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
