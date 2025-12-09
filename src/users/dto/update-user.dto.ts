import { IsEmail, IsOptional, IsString } from 'class-validator';
// Import the validators
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: 'admin' | 'technician' | 'client';
}