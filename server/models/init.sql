-- Author: Chris Buonocore
-- AnchorSupply SQL schema setup code.

--DROP DATABASE IF EXISTS anchor;
CREATE DATABASE anchor;
\c anchor;

CREATE TABLE item (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(64),
  unit VARCHAR,
  metadata VARCHAR,
  uuid VARCHAR,
  origin VARCHAR,
  packDate VARCHAR
);

CREATE TABLE delivery (
  ID SERIAL PRIMARY KEY,
  itemId SERIAL REFERENCES item(ID),
  locationId SERIAL,
  lat float(7),
  lng float(7),
  timeMs bigint,
  name VARCHAR
);

CREATE TABLE proof (
    ID SERIAL PRIMARY KEY,
    deliveryId SERIAL REFERENCES delivery(ID),
    hashValue VARCHAR, -- hashed delivery .
    proofValue VARCHAR -- proof of hashed delivery integrity.
);
