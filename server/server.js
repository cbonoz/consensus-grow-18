// Author: Chris Buonocore (April 2018)
// Project: AnchorSupply
// License: MIT
// Made for DV Hacks 2018

(function () {
    "use strict";

    /*************************
     * CONFIGURATION VARIABLES
     *************************/
    const user = process.env.ANCHOR_SUPPLY_DB_USER || "postgres";
    const pass = process.env.ANCHOR_SUPPLY_DB_PASS || "admin";
    const host = process.env.ANCHOR_SUPPLY_HOST || "localhost";
    const db = process.env.ANCHOR_SUPPLY_DB || "anchorSupply";
    const PORT = process.env.ANCHOR_SUPPLY_SERVER_PORT || 9001;

    const COMPUTE_LIMIT_MS = 1000;
    const INF = 1000000;

    /***********
     * LIBRARIES
     ***********/
    const axios = require('axios');
    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const http = require('http');
    const {Pool, Client} = require('pg');
    const anchorSupply = require('./anchorSupply');

    /*******
     * SETUP
     *******/
    const app = express();
    const server = http.createServer(app);
    // const io = require('socket.io')(server, {origins: '*:*'});
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(cors());

    const connectionString = `postgres://${user}:${pass}@${host}:5432/${db}`;
    console.log('connectionString', connectionString);

    const pool = new Pool({
        connectionString: connectionString,
    });

    /***********
     * ENDPOINTS
     ***********/
    app.get('/api/hello', (req, res) => {
        return res.json("hello world");
    });

    /*
     * Returns registered ports.
     */
    app.get('/api/ports', (err, res) => {
        const portQuery = `SELECT * from port`;
        pool.query(portQuery, (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data.rows);
        });
    });

    /*
     * Register new ports with the AnchorSupply DB.
     * {
     *  ports: [ {name, latitude, longitude}, ... ]
     * }
     */
    app.post('/api/ports/add', function (req, res, next) {
        const body = req.body;
        const ports = body.ports;

        const values = ports.map((port) => {
            return `('${port.name}', ${port.lat}, ${port.lng})`;
        });
        const insertQuery = `INSERT INTO port(name, lat, lng) VALUES${values.join(',')} ON CONFLICT DO NOTHING`;
        // console.log('port insertQuery', insertQuery);
        pool.query(insertQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data);
        });
    });


    /**
     * Register a new person
     * {
     *  person: [ {pickupId, deliveryId, jobDate} ... ]
     * }
     */
    app.post('/api/register', function (req, res, next) {
        const body = req.body;
        const name = body.name;
        const email = body.email;
        if (email === undefined || email === "") {
            return res.status(500).json("email must be defined");
        }

        if (name === undefined || name === "") {
            return res.status(500).json("name must be defined");
        }

        const insertQuery = `INSERT INTO person(name, email) VALUES('${name}', '${email}')`;
        console.log('job insertQuery', insertQuery);

        pool.query(insertQuery, (err, jobData) => {
            if (err) {
                const msg = JSON.stringify(err);
                res.status(500).json(err);
            }
            return res.status(200).json(jobData);
        });
    });


    /**
     * Add the jobs to the db.
     * {
     *  jobs: [ {pickupId, deliveryId, jobDate} ... ]
     * }
     */
    app.post('/api/jobs/add', function (req, res, next) {
        const body = req.body;
        const jobs = body.jobs;

        const values = jobs.map((job) => {
            return `(${job.pickupId}, ${job.deliveryId}, '${job.jobDate}')`;
        });
        const insertQuery = `INSERT INTO job(pickupId, deliveryId, jobDate) VALUES${values.join(',')} ON CONFLICT DO NOTHING`;
        console.log('job insertQuery', insertQuery);

        pool.query(insertQuery, (err, jobData) => {
            if (err) {
                const msg = JSON.stringify(err);
                res.status(500).json(err);
            }
            return res.status(200).json(jobData);
        });
    });

    server.listen(PORT, () => {
        console.log('Express server listening on localhost port: ' + PORT);
    });
}());
