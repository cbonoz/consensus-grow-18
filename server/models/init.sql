-- Author: Chris Buonocore
-- AnchorSupply SQL schema setup code.

--DROP DATABASE IF EXISTS anchorSupply;
CREATE DATABASE anchor;
\c anchor;


CREATE TABLE item (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(64),
  metadata VARCHAR,
  uuid VARCHAR,
  origin VARCHAR,
  packDate VARCHAR
);

CREATE TABLE receipt (
  itemId  SERIAL REFERENCES port(ID),
  locationId SERIAL REFERENCES port(ID),
  lat float(7),
  lng float(7),
  timestamp bigint
  PRIMARY KEY (itemId, locationid)
);

-- CREATE TABLE person (
--     ID SERIAL PRIMARY KEY,
--     name VARCHAR(64),
--     email VARCHAR(64) unique
-- )

--CREATE TABLE driver (
--  ID SERIAL PRIMARY KEY,
--  name VARCHAR(64)
--);
