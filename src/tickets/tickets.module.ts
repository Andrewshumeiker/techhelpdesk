import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './ticket.entity';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
import { Category } from '../categories/category.entity';
// Import the entities
@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Client, Technician, Category])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}