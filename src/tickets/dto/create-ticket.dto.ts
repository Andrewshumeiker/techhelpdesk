import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '../enums/priority.enum';
// Decorator to validate the data
export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsString()
  categoryId: string;

  @IsString()
  clientId: string;

  // Optionally, a technician can be assigned when creating the ticket
  @IsOptional()
  @IsString()
  technicianId?: string;
}