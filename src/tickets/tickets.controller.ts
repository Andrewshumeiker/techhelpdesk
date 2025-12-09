import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /**
   * Creates a ticket.  Must be an authenticated client (or admin) and send the client and category ids.
   */
  @Post()
  @Roles('client', 'admin')
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  /**
   * Changes the status of an assigned ticket.  Only technicians or admins.
   */
  @Patch(':id/status')
  @Roles('technician', 'admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.ticketsService.updateStatus(id, dto);
  }

  /**
   * Returns the tickets of a specific client.  The role can be client (own) or admin.
   */
  @Get('client/:id')
  @Roles('client', 'admin')
  findByClient(@Param('id') id: string) {
    return this.ticketsService.findByClient(id);
  }

  /**
   * Returns the tickets assigned to a technician.  Technician or admin role.
   */
  @Get('technician/:id')
  @Roles('technician', 'admin')
  findByTechnician(@Param('id') id: string) {
    return this.ticketsService.findByTechnician(id);
  }

  /**
   * Lists all tickets.  Only admins.
   */
  @Get()
  @Roles('admin')
  findAll() {
    return this.ticketsService.findAll();
  }
}