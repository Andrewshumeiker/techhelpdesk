import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a client.
 */
export class CreateClientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}