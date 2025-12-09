import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * DTO for registering a new user. Depending on the role, 
 * additional fields may be sent to create the associated Client or Technician entity.
 */
export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: 'admin' | 'technician' | 'client';

  // Client-specific fields
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  // Technician-specific fields
  @IsOptional()
  @IsString()
  specialty?: string;
}