import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Technician) private readonly techniciansRepository: Repository<Technician>,
  ) { }

  /**
   * Find a user by id.
   */
  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Find a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Create a new user and, according to the role, the associated Client or Technician entity.
   */
  async createWithProfile(dto: RegisterDto): Promise<User> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });
    const savedUser = await this.usersRepository.save(user);

    if (dto.role === 'client') {
      const client = this.clientsRepository.create({
        name: dto.name,
        company: dto.company,
        contactEmail: dto.contactEmail ?? dto.email,
        user: savedUser,
      });
      await this.clientsRepository.save(client);
    } else if (dto.role === 'technician') {
      const technician = this.techniciansRepository.create({
        name: dto.name,
        specialty: dto.specialty,
        user: savedUser,
      });
      await this.techniciansRepository.save(technician);
    }
    return savedUser;
  }

  /**
   * Create a simple user without associated entities. Reserved for administrators.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });
    return this.usersRepository.save(user);
  }

  /**
   *  Returns all registered users.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Update a user's fields.
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    await this.usersRepository.update(id, dto as any);
    return (await this.findOne(id))!;
  }

  /**
   * Delete a user by id.
   */
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}