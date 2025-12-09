import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from './technician.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician) private readonly techniciansRepository: Repository<Technician>,
  ) {}

  async create(dto: CreateTechnicianDto): Promise<Technician> {
    const technician = this.techniciansRepository.create(dto);
    return this.techniciansRepository.save(technician);
  }

  async findAll(): Promise<Technician[]> {
    return this.techniciansRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Technician | null> {
    return this.techniciansRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: string, dto: UpdateTechnicianDto): Promise<Technician> {
    await this.techniciansRepository.update(id, dto);
    return this.findOne(id) as Promise<Technician>;
  }

  async remove(id: string): Promise<void> {
    await this.techniciansRepository.delete(id);
  }
}