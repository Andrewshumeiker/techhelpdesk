# TechHelpDesk API

A comprehensive technical support ticket management system built with NestJS, TypeORM, and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Technician, Client)
  - Custom decorators (@CurrentUser, @Roles)
  
- **Ticket Management**
  - Create, read, update tickets
  - State machine for ticket status (ABIERTO → EN_PROGRESO → RESUELTO → CERRADO)
  - Validation rules (maximum 5 active tickets per technician)
  - Priority levels (alta, media, baja)
  
- **User Management**
  - Admin, Technician, and Client profiles
  - User CRUD operations
  - Password hashing with bcrypt
  
- **Data Validation**
  - Global ValidationPipe
  - DTOs with class-validator
  - Custom business rule validations
  
- **API Features**
  - RESTful endpoints
  - Swagger/OpenAPI documentation
  - Global exception filter
  - Response transformation interceptor

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Docker** (v20 or higher) - [Download](https://www.docker.com/)
- **Docker Compose** (v2 or higher) - Usually included with Docker Desktop
- **Git** - [Download](https://git-scm.com/)

To verify installations, run:
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show v9.x or higher
docker --version  # Should show v20.x or higher
git --version     # Should show v2.x or higher
```

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Andrewshumeiker/techhelpdesk.git
cd techhelpdesk
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`. The installation might take 2-5 minutes depending on your internet connection.

## Database Setup

### Step 1: Start PostgreSQL with Docker

The project includes a Docker Compose configuration for PostgreSQL. Start the database container:

```bash
docker compose up -d db
```

**Explanation:**
- `docker compose up` - Starts services defined in `docker-compose.yml`
- `-d` - Runs containers in detached mode (background)
- `db` - Only starts the database service (not the API)

**Verify the database is running:**
```bash
docker ps
```

You should see a container named `techhelpdesk_db` with status "Up".

### Step 2: Create Environment File

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

The `.env` file should contain:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=techhelpdesk

JWT_SECRET=supersecret
JWT_EXPIRES_IN=3600s
```

**Important:** Do NOT change these values unless you also modify `docker-compose.yml`.

### Step 3: Seed the Database

Populate the database with initial data (categories, admin user, demo users):

```bash
npm run seed
```

**Expected output:**
```
Connected to the database
Categories inserted
Admin user created
Technician demo created
Client demo created
Seeding completed
```

**Default users created:**
- Admin: `admin@example.com` / `admin123`
- Technician: `tech@example.com` / `tech123`
- Client: `client@example.com` / `client123`

## Running the Application

### Development Mode (Recommended)

```bash
npm run start:dev
```

The application will start with hot-reload enabled. Any changes to `.ts` files will automatically restart the server.

**Expected output:**
```
[Nest] 12345  - 12/09/2024, 9:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/09/2024, 9:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
...
[Nest] 12345  - 12/09/2024, 9:00:01 AM     LOG [NestApplication] Nest application successfully started
```

**Access the application:**
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Using Docker (Optional)

To run the entire application (API + Database) in containers:

```bash
docker compose up -d
```

This starts both the `db` and `api` services defined in `docker-compose.yml`.

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:cov
```

**Current coverage:** ~71% of statements

**Test file location:** `test/tickets.e2e-spec.ts`

**What's tested:**
- User authentication (login)
- Ticket creation with validations
- Status transitions (ABIERTO → EN_PROGRESO → RESUELTO → CERRADO)
- Validation that status cannot skip steps
- Ticket history queries

## API Documentation

### Swagger UI

Once the application is running, access the interactive API documentation:

**URL:** http://localhost:3000/docs

From Swagger UI you can:
- View all available endpoints
- See request/response schemas
- Test endpoints directly from the browser
- Download the OpenAPI specification

### Using Postman

1. Open Postman
2. Import the OpenAPI spec from: http://localhost:3000/docs-json
3. All endpoints will be imported automatically

### Key Endpoints

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

**Tickets:**
- `POST /tickets` - Create ticket (requires auth)
- `GET /tickets` - List all tickets (requires auth)
- `GET /tickets/client/:clientId` - Get tickets by client
- `GET /tickets/technician/:technicianId` - Get tickets by technician
- `PATCH /tickets/:id/status` - Change ticket status

**Users, Clients, Technicians, Categories:**
- Standard CRUD endpoints for each resource

## Project Structure

```
techhelpdesk/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Login/Register DTOs
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # Auth logic
│   │   ├── jwt.strategy.ts      # JWT validation strategy
│   │   └── jwt-auth.guard.ts    # JWT guard
│   │
│   ├── users/                   # Users module
│   │   ├── dto/                 # User DTOs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── user.entity.ts       # User entity
│   │
│   ├── clients/                 # Clients module
│   ├── technicians/             # Technicians module
│   ├── categories/              # Categories module
│   ├── tickets/                 # Tickets module (core)
│   │   ├── dto/
│   │   ├── enums/               # Status & Priority enums
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts   # Business logic
│   │   └── ticket.entity.ts
│   │
│   ├── common/                  # Shared resources
│   │   ├── decorators/          # @CurrentUser, @Roles
│   │   ├── guards/              # RolesGuard
│   │   ├── filters/             # Exception filter
│   │   └── interceptors/        # Response transformer
│   │
│   ├── seeds/                   # Database seeding
│   │   └── seed.ts
│   │
│   ├── app.module.ts            # Main application module
│   └── main.ts                  # Application entry point
│
├── test/
│   └── tickets.e2e-spec.ts      # E2E tests
│
├── docker-compose.yml           # Docker services config
├── Dockerfile                   # API container config
├── database.sql                 # SQL schema (reference)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Environment Variables

Create a `.env` file with these variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | PostgreSQL host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | Yes |
| `DB_USERNAME` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | `postgres` | Yes |
| `DB_NAME` | Database name | `techhelpdesk` | Yes |
| `JWT_SECRET` | Secret for JWT signing | `supersecret` | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `3600s` | Yes |

**Security Note:** In production, use strong passwords and secrets. Never commit `.env` files to version control.

## Authentication Flow

1. **Register** a user: `POST /auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "secure123",
     "role": "client"
   }
   ```

2. **Login** to get JWT token: `POST /auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "secure123"
   }
   ```

3. **Use token** in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Ticket Status Flow

Tickets must follow this exact sequence:

```
ABIERTO → EN_PROGRESO → RESUELTO → CERRADO
```

You **cannot** skip states. For example:
- ✅ ABIERTO → EN_PROGRESO (valid)
- ❌ ABIERTO → CERRADO (invalid, will return 400 error)

## Troubleshooting

### Database Connection Error

**Problem:** `ECONNREFUSED` or connection timeout

**Solution:**
1. Ensure Docker is running: `docker ps`
2. Verify database container is up: `docker compose up -d db`
3. Check `.env` file has correct credentials
4. Wait 10 seconds after starting the container

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
# Edit src/main.ts and change port number
```

### TypeScript Errors

**Problem:** Cannot find module or type errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Contributors

- **Andrewshumeiker** - Initial work
- **Andres covaleda** - linus
  
## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database with [TypeORM](https://typeorm.io/)
- Authentication with [Passport](http://www.passportjs.org/)
