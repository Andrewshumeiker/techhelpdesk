import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';
import { Ticket } from '../tickets/ticket.entity';
import * as bcrypt from 'bcryptjs';

// Configuration of the TypeORM connection.  It takes from environment variables.
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Category, Client, Technician, Ticket],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to the database');

  // Initial categories
  const categories = [
    { name: 'Request', description: 'General requests' },
    { name: 'Hardware Incident', description: 'Hardware problems' },
    { name: 'Software Incident', description: 'Software problems' },
  ];
  const categoryRepo = AppDataSource.getRepository(Category);
  for (const c of categories) {
    const exists = await categoryRepo.findOne({ where: { name: c.name } });
    if (!exists) {
      await categoryRepo.save(categoryRepo.create(c));
    }
  }
  console.log('Categories inserted');

  // Admin user
  const userRepo = AppDataSource.getRepository(User);
  let admin = await userRepo.findOne({ where: { email: 'admin@example.com' } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = userRepo.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    await userRepo.save(admin);
    console.log('Admin user created');
  }

  // Technician demo
  const techRepo = AppDataSource.getRepository(Technician);
  let tech = await techRepo.findOne({ where: { name: 'Technician Demo' } });
  if (!tech) {
    const hashedPassword = await bcrypt.hash('tech123', 10);
    const user = userRepo.create({
      name: 'Technician Demo',
      email: 'tech@example.com',
      password: hashedPassword,
      role: 'technician',
    });
    await userRepo.save(user);
    tech = techRepo.create({
      name: 'Technician Demo',
      specialty: 'General',
      user,
    });
    await techRepo.save(tech);
    console.log('Technician demo created');
  }

  // Client demo
  const clientRepo = AppDataSource.getRepository(Client);
  let client = await clientRepo.findOne({ where: { name: 'Client Demo' } });
  if (!client) {
    const hashedPassword = await bcrypt.hash('client123', 10);
    const user = userRepo.create({
      name: 'Client Demo',
      email: 'client@example.com',
      password: hashedPassword,
      role: 'client',
    });
    await userRepo.save(user);
    client = clientRepo.create({
      name: 'Client Demo',
      company: 'Company Demo',
      contactEmail: 'contact@demo.com',
      user,
    });
    await clientRepo.save(client);
    console.log('Client demo created');
  }
  await AppDataSource.destroy();
  console.log('Seeding completed');
}

seed().catch((err) => {
  console.error(err);
});