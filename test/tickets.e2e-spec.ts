import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

/**
 * E2E Tests for Tickets Module
 * 
 * NOTE: Due to the limited 8-hour timeframe to build the entire project from scratch,
 * these tests are intentionally brief and focus only on the core requirements:
 * 1. Ticket creation with validations
 * 2. Status change following the required sequence
 * 
 * Setting up the full project (entities, relations, auth, guards, interceptors, 
 * swagger, docker, seeds, etc.) took most of the available time, so the tests 
 * cover the essential functionality rather than exhaustive edge cases.
 */
describe('Tickets (e2e)', () => {
    let app: INestApplication;

    // Variables to store test data
    let adminToken: string;
    let clientId: string;
    let technicianId: string;
    let categoryId: string;
    let ticketId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        app.useGlobalInterceptors(new TransformInterceptor());
        await app.init();
    }, 30000); // 30 second timeout for setup

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    // Login with the admin user created by seeds
    describe('Authentication', () => {
        it('should login as admin', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'admin@example.com', password: 'admin123' });

            expect(res.status).toBe(201);
            adminToken = res.body.data?.access_token;
            expect(adminToken).toBeDefined();
        });
    });

    // Get the IDs needed to create tickets
    describe('Get data for ticket creation', () => {
        it('should get clients list', async () => {
            const res = await request(app.getHttpServer())
                .get('/clients')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            clientId = res.body.data[0].id;
        });

        it('should get technicians list', async () => {
            const res = await request(app.getHttpServer())
                .get('/technicians')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            technicianId = res.body.data[0].id;
        });

        it('should get categories list', async () => {
            const res = await request(app.getHttpServer())
                .get('/categories')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            categoryId = res.body.data[0].id;
        });
    });

    // MAIN TEST 1: Ticket creation
    describe('Ticket Creation', () => {
        it('should create a ticket successfully', async () => {
            const res = await request(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'System issue',
                    description: 'The system is not loading correctly',
                    priority: 'alta',
                    clientId: clientId,
                    categoryId: categoryId,
                    technicianId: technicianId,
                });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.title).toBe('System issue');
            expect(res.body.data.status).toBe('abierto');

            // Save ID for next tests
            ticketId = res.body.data.id;
        });

        it('should fail without clientId', async () => {
            const res = await request(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Ticket without client',
                    description: 'Missing client',
                    priority: 'media',
                    categoryId: categoryId,
                });

            expect(res.status).toBe(400);
        });

        it('should fail without categoryId', async () => {
            const res = await request(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Ticket without category',
                    description: 'Missing category',
                    priority: 'media',
                    clientId: clientId,
                });

            expect(res.status).toBe(400);
        });
    });

    // MAIN TEST 2: Status change
    describe('Status Change', () => {
        it('should change from ABIERTO to EN_PROGRESO', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/tickets/${ticketId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'en_progreso' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('en_progreso');
        });

        it('should change from EN_PROGRESO to RESUELTO', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/tickets/${ticketId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'resuelto' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('resuelto');
        });

        it('should change from RESUELTO to CERRADO', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/tickets/${ticketId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'cerrado' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('cerrado');
        });

        it('should NOT allow skipping from ABIERTO to CERRADO', async () => {
            // Create another ticket for this test
            const createRes = await request(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Ticket to test skip',
                    description: 'Test',
                    priority: 'baja',
                    clientId: clientId,
                    categoryId: categoryId,
                });

            const newTicketId = createRes.body.data.id;

            // Try to skip states
            const res = await request(app.getHttpServer())
                .patch(`/tickets/${newTicketId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'cerrado' });

            expect(res.status).toBe(400);
        });
    });

    // Ticket history queries
    describe('Ticket History', () => {
        it('should list tickets by client', async () => {
            const res = await request(app.getHttpServer())
                .get(`/tickets/client/${clientId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should list tickets by technician', async () => {
            const res = await request(app.getHttpServer())
                .get(`/tickets/technician/${technicianId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
});
