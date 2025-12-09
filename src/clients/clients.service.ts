import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

/**
 * Service for clients.
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
  ) { }

  /**
   * Creates a new client.
   * @param dto - The client data transfer object.
   * @returns The created client.
   */
  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(dto);
    return this.clientsRepository.save(client);
  }

  /**
   * Returns all clients.
   * @returns An array of clients.
   */
  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({ relations: ['user'] });
  }

  /**
   * Returns a client by ID.
   * @param id - The ID of the client.
   * @returns The client with the specified ID.
   */
  async findOne(id: string): Promise<Client | null> {
    return this.clientsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async findByUserId(userId: string): Promise<Client | null> {
    return this.clientsRepository.findOne({ where: { user: { id: userId } } });
  }

  /**
   * Updates a client by ID.
   * @param id - The ID of the client to update.
   * @param dto - The client data transfer object.
   * @returns The updated client.
   */
  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    await this.clientsRepository.update(id, dto);
    return this.findOne(id) as Promise<Client>;
  }

  /**
   * Removes a client by ID.
   * @param id - The ID of the client to remove.
   */
  async remove(id: string): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}