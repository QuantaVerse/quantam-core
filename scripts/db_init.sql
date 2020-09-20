CREATE DATABASE "quantam";

-- Extend the database with TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Role: quantam_admin
-- DROP ROLE quantam_admin;

CREATE ROLE quantam_admin WITH
  LOGIN
  SUPERUSER
  INHERIT
  CREATEDB
  CREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'md5645a1ed1c7d5f0388d3dd3e73d670d82';