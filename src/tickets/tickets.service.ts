import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
import { Category } from '../categories/category.entity';
import { TicketStatus } from './enums/status.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Technician) private readonly techniciansRepository: Repository<Technician>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
  ) { }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    // Verify client
    const client = await this.clientsRepository.findOne({ where: { id: dto.clientId } });
    if (!client) {
      throw new BadRequestException('Invalid client');
    }
    // Verify category
    const category = await this.categoriesRepository.findOne({ where: { id: dto.categoryId } });
    if (!category) {
      throw new BadRequestException('Invalid category');
    }
    let technician: Technician | null = null;
    if (dto.technicianId) {
      technician = await this.techniciansRepository.findOne({ where: { id: dto.technicianId }, relations: ['tickets'] });
      if (!technician) {
        throw new BadRequestException('Invalid technician');
      }
      // Verify that the technician does not have more than 5 tickets in progress
      const inProgress = technician.tickets?.filter((t) => t.status === TicketStatus.EN_PROGRESO) ?? [];
      if (inProgress.length >= 5) {
        throw new BadRequestException('The technician already has 5 tickets in progress');
      }
    }
    const ticket = this.ticketsRepository.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      client,
      category,
      technician: technician || undefined,
    });
    return this.ticketsRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find();
  }

  async findByClient(clientId: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({ where: { client: { id: clientId } } });
  }

  async findByTechnician(technicianId: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({ where: { technician: { id: technicianId } } });
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.ticketsRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id }, relations: ['technician'] });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    // Update simple fields
    if (dto.title) ticket.title = dto.title;
    if (dto.description) ticket.description = dto.description;
    if (dto.priority) ticket.priority = dto.priority;
    // Update category
    if (dto.categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new BadRequestException('Invalid category');
      ticket.category = category;
    }
    // Reassign technician
    if (dto.technicianId) {
      const technician = await this.techniciansRepository.findOne({ where: { id: dto.technicianId }, relations: ['tickets'] });
      if (!technician) throw new BadRequestException('Invalid technician');
      // Verify tickets in progress
      const inProgress = technician.tickets?.filter((t) => t.status === TicketStatus.EN_PROGRESO && t.id !== ticket.id) ?? [];
      if (inProgress.length >= 5) {
        throw new BadRequestException('The technician already has 5 tickets in progress');
      }
      ticket.technician = technician;
    }
    return this.ticketsRepository.save(ticket);
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id }, relations: ['technician'] });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    // Validate state transition
    const allowedTransitions: Record<TicketStatus, TicketStatus | null> = {
      [TicketStatus.ABIERTO]: TicketStatus.EN_PROGRESO,
      [TicketStatus.EN_PROGRESO]: TicketStatus.RESUELTO,
      [TicketStatus.RESUELTO]: TicketStatus.CERRADO,
      [TicketStatus.CERRADO]: null,
    };
    const next = allowedTransitions[ticket.status];
    if (next !== dto.status) {
      throw new BadRequestException(`Transition not allowed from ${ticket.status} to ${dto.status}`);
    }
    // If it goes to EN_PROGRESO, verify that the technician does not exceed the limit
    if (dto.status === TicketStatus.EN_PROGRESO && ticket.technician) {
      const tech = await this.techniciansRepository.findOne({ where: { id: ticket.technician.id }, relations: ['tickets'] });
      const inProgress = tech?.tickets?.filter((t) => t.status === TicketStatus.EN_PROGRESO && t.id !== ticket.id) ?? [];
      if (inProgress.length >= 5) {
        throw new BadRequestException('The technician already has 5 tickets in progress');
      }
    }
    ticket.status = dto.status;
    return this.ticketsRepository.save(ticket);
  }
}