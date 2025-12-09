import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
import { Category } from '../categories/category.entity';
import { TicketStatus } from './enums/status.enum';
import { TicketPriority } from './enums/priority.enum';

/**
 * Entity that represents a support ticket.  Stores its title, description,
 * status, priority and the relationships with client, technician and category.
 */
@Entity() // Decorator to define the entity
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.ABIERTO })
  status: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIA })
  priority: TicketPriority;

  @ManyToOne(() => Client, (client) => client.tickets, { eager: true })
  client: Client;

  @ManyToOne(() => Technician, (technician) => technician.tickets, { eager: true, nullable: true })
  technician: Technician;

  @ManyToOne(() => Category, (category) => category.tickets, { eager: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}