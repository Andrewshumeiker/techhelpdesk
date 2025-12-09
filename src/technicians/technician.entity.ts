import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';

/**
 * Entity that stores additional information about users with technician role.
 */
@Entity()
export class Technician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ default: true })
  availability: boolean;

  @OneToOne(() => User, (user) => user.technician, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.technician)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}