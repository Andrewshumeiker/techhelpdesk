import { IsEnum } from 'class-validator';
import { TicketStatus } from '../enums/status.enum';
// Decorator to validate the data
export class UpdateStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;
}