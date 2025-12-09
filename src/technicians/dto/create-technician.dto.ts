// Decorator to validate the data
import { IsOptional, IsString } from 'class-validator';

export class CreateTechnicianDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}