-- Create database and user if they don't exist
CREATE DATABASE frontzap;
CREATE USER frontzap_user WITH ENCRYPTED PASSWORD 'your_secure_postgres_password';
GRANT ALL PRIVILEGES ON DATABASE frontzap TO frontzap_user;

-- Connect to the frontzap database
\c frontzap;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO frontzap_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO frontzap_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO frontzap_user;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
