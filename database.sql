-- ============================
-- DATABASE
-- ============================
CREATE DATABASE support_system;
\c support_system;

-- ============================
-- ENUMS
-- ============================
CREATE TYPE user_role AS ENUM ('ADMIN', 'TECHNICIAN', 'CLIENT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- ============================
-- USERS
-- ============================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- CLIENTS
-- ============================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    contact_email VARCHAR(150) NOT NULL,
    CONSTRAINT fk_client_user FOREIGN KEY(user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- TECHNICIANS
-- ============================
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    specialty VARCHAR(150),
    availability BOOLEAN DEFAULT true,
    CONSTRAINT fk_technician_user FOREIGN KEY(user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- CATEGORIES
-- ============================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ============================
-- TICKETS
-- ============================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'OPEN',
    priority ticket_priority DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    category_id UUID NOT NULL,
    client_id UUID NOT NULL,
    technician_id UUID,

    CONSTRAINT fk_ticket_category FOREIGN KEY(category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_ticket_client FOREIGN KEY(client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_technician FOREIGN KEY(technician_id)
        REFERENCES technicians(id)
        ON DELETE SET NULL
);

-- ============================
-- INDEXES (RENDIMIENTO)
-- ============================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
