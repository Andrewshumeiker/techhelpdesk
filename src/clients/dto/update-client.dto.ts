import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a client.
 */
export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}