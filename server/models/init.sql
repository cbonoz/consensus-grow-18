-- Author: Chris Buonocore
-- AnchorSupply SQL schema setup code.

--DROP DATABASE IF EXISTS anchorSupply;
CREATE DATABASE anchor;
\c anchor;

-- CREATE TABLE port (
--   ID SERIAL PRIMARY KEY,
--   name VARCHAR(64) UNIQUE,
--   lat float(7),
--   lng float(7)
-- );

-- CREATE TABLE job (
--   pickupId  SERIAL REFERENCES port(ID),
--   deliveryId SERIAL REFERENCES port(ID),
--   jobDate VARCHAR(64),
--   PRIMARY KEY (pickupId, deliveryId, jobDate)
-- );

-- CREATE TABLE person (
--     ID SERIAL PRIMARY KEY,
--     name VARCHAR(64),
--     email VARCHAR(64) unique
-- )

--CREATE TABLE driver (
--  ID SERIAL PRIMARY KEY,
--  name VARCHAR(64)
--);
