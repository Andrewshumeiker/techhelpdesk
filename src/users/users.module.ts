import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
// Import the clients and technicians modules
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, Technician]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}