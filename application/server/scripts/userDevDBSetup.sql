-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ratings_dev_db;

-- Use the new database
USE ratings_dev_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial user data into the users table
INSERT INTO users (name, email, password) VALUES 
('Alice Smith', 'alice.smith@example.com', '$2a$10$EIX/9rRBRZG0syGm5McZ1.3pO9xPhQPrG2.LM.cHg35VgPBUtHpO2'), 
('Bob Johnson', 'bob.johnson@example.com', '$2a$10$R1G6h/DqTr7U9M9j0zBP2u8NEClM24z3cVZx7MucZyU2W/u2W9Y1C'), 
('Charlie Brown', 'charlie.brown@example.com', '$2a$10$6C6sT06aUZzTR6fqE1.WFu2M8Hh1WltWSCC90kYoZBU0vC6oRDS8O'), 
('David Wilson', 'david.wilson@example.com', '$2a$10$6C6sT06aUZzTR6fqE1.WFu2M8Hh1WltWSCC90kYoZBU0vC6oRDS8O'), 
('Eve Davis', 'eve.davis@example.com', '$2a$10$F6mR6rPbU5REhDdePeVwx.yfzLv1mtN0Iz0J9aO0uf3lmXbZdfLVS');
