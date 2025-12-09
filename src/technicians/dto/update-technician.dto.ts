// Decorator to validate the data
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTechnicianDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}