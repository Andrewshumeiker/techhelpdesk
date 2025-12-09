import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { TechniciansModule } from './technicians/technicians.module';
import { CategoriesModule } from './categories/categories.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    // Import variables of environment globally
    ConfigModule.forRoot({ isGlobal: true }),
    // Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // In production it is recommended to set it to false.  For testing purposes it is left true.
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    ClientsModule,
    TechniciansModule,
    CategoriesModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}