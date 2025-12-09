import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';

/**
 * Entity that represents a user in the system.  A user can have one of the
 * roles defined (admin, technician, client).  Additional client and technician
 * data is found in the corresponding entities and are linked through
 * 1:1 relationships.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  /**
   * Role of the user: 'admin', 'technician' or 'client'.
   */
  @Column()
  role: string;

  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  client?: Client;

  @OneToOne(() => Technician, (technician) => technician.user, { nullable: true })
  technician?: Technician;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}