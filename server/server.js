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
    const db = process.env.ANCHOR_SUPPLY_DB || "anchor";
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
    const anchor = require('./anchor');
    const escape = require('pg-escape');

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
     * Returns registered items.
     */
    app.get('/api/items', (err, res) => {
        const itemQuery = `SELECT * from item`;
        pool.query(itemQuery, (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data.rows);
        });
    });

     /*
     * Returns registered items.
     */
    app.get('/api/deliveries', (err, res) => {
        const itemQuery = `SELECT * from delivery`;
        pool.query(itemQuery, (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data.rows);
        });
    });

    app.get('/api/item/history/:itemId', (err, res) => {
        const itemId = req.params.itemId;
        const itemQuery = `SELECT * from delivery where itemId=${itemId}`;
        console.log(itemQuery);
        pool.query(itemQuery, (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data.rows);
        });
    })

    /*
     * Register new deliveries with the AnchorSupply DB.
     * {
     *  deliveries: [ {itemId, locationId, latitude, longitude, timeMs}, ... ]
     * }
     */
    app.post('/api/deliveries/add', function (req, res, next) {
        const body = req.body;
        const deliveries = body.deliveries;

        const values = deliveries.map((item) => {
            console.log('item',item)
            return `(${item.itemId}, ${item.locationId}, ${item.lat}, ${item.lng}, ${item.timeMs})`;
        });

        const insertQuery = escape(`INSERT INTO delivery(itemId, locationId, lat, lng, timeMs) VALUES${values.join(',')} ON CONFLICT DO NOTHING RETURNING *`);
        console.log('item insertQuery', insertQuery);
        pool.query(insertQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log(err);
                return res.status(500).json(msg);
            }
            console.log('delivery data', data)
            const inserted = data.rows;
            console.log('inserted', inserted.length);
            anchor.saveDeliveries(inserted, pool);

            return res.status(200).json(data);
        });
    });

    app.post('/api/proofs', function (req, res, next) {
        const body = req.body;
        const deliveryIds = body.deliveryIds;

        const valueString = deliveryIds.join(',');

        const selectQuery = `SELECT * from proofs where deliveryId in (${valueString}) RETURNING *`;
        console.log('selectQuery', selectQuery);
        pool.query(selectQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log(err);
                return res.status(500).json(msg);
            }

            const inserted = data.rows;
            console.log('inserted proofs', inserted.length);

            return res.status(200).json(data);
        });
    });

    /*
     * Register new items with the AnchorSupply DB.
     * {
     *  items: [ {name, unit, metdata, uuid, origin, packDate}, ... ]
     * }
     */
    app.post('/api/items/add', function (req, res, next) {
        const body = req.body;
        const items = body.items;

        const values = items.map((item) => {
            return `('${item.name}', '${item.unit}', '${item.metadata}', '${item.uuid}', '${item.origin}', '${item.packDate}')`;
        });

        const insertQuery = escape(`INSERT INTO item(name, unit, metadata, uuid, origin, packDate) VALUES${values.join(',')} ON CONFLICT DO NOTHING  RETURNING *`);
        // console.log('item insertQuery', insertQuery);
        pool.query(insertQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log(err);
                return res.status(500).json(msg);
            }

            return res.status(200).json(data);
        });
    });

    server.listen(PORT, () => {
        console.log('Express server listening on localhost port: ' + PORT);
    });
}());
