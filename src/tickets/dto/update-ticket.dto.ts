import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '../enums/priority.enum';
// Decorator to validate the data
export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  technicianId?: string;
}