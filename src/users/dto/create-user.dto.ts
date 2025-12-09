import { IsEmail, IsOptional, IsString } from 'class-validator';
// Import the validators
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: 'admin' | 'technician' | 'client';

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}