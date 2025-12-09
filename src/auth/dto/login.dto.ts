import { IsEmail, IsString } from 'class-validator';

/**
 * DTO for logging in a user. 
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}