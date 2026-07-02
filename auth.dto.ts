import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmed Mohammed' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+966501234567' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty({ enum: ['phone', 'email'] })
  @IsString()
  type: string;
}
