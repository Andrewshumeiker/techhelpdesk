import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  /**
   * Only admins can create clients manually.
   */
  @Post()
  @Roles('admin')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  /**
   * Only admins can list all clients.
   */
  @Get()
  @Roles('admin')
  findAll() {
    return this.clientsService.findAll();
  }

  /**
   * Only admins or the same client can get a client by id.
   */
  @Get(':id')
  @Roles('admin', 'client')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== 'admin') {
      const client = await this.clientsService.findByUserId(user.id);
      if (!client || client.id !== id) {
        throw new ForbiddenException('You can only view your own profile');
      }
    }
    return this.clientsService.findOne(id);
  }

  /**
   * Only admins can update a client by id.
   */
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  /**
   * Only admins can delete a client by id.
   */
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}