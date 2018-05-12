/**
 * Created by cbuonocore on 4/13/18.
 */
const library = (function () {

    const chp = require('chainpoint-client');
    const cpb = require('chainpoint-binary')
    const hash = require('object-hash');
    const geolib = require('geolib');
    const BASE_URL = "localhost:9001";

    // Returns the arc distance between two lat/lng pairs in kilometers.
    // ex: return geolib.getDistance(
    //     {latitude: 51.5103, longitude: 7.49347},
    //     {latitude: "51° 31' N", longitude: "7° 28' E"}
    // );
    function getDistance(point1, point2) {
        return geolib.getDistance(point1, point2) / 1000.0; // km
        // return geoLib.distance([[point1.latitude,point1.longitude], [point2.latitude, point2.longitude]]).distance;
    }

    function matrix(m, n, fillValue) {
        const result = [];
        for (let i = 0; i < n; i++) {
            result.push(new Array(m).fill(fillValue));
        }
        return result;
    }

    function getToday() {
        const date = new Date();
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }

    async function saveDeliveries(deliveries, pool) {
        // A few sample SHA-256 proofs to anchor
        // const hashes = ['1d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a',
        //     '2d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a',
        //     '3d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a'
        // ]
        if (!deliveries || !pool) {
            throw 'deliveries or sql pool was undefined'
            return;
        }

        if (deliveries.length > 80)  {
            // not the max for getProofs is 250, using 80*3 as a approx bound
            throw 'cannot save more than 80 deliveries at a time, attempted: ' + deliveries.length
        }

        const hashes = deliveries.map((d) => {
            return hash(d);
        });

        // Submit each hash to three randomly selected Nodes
        let proofHandles = await chp.submitHashes(hashes)
        // console.log("Submitted Proof Objects: Expand objects below to inspect.")
        // console.log(proofHandles)

        // Wait for Calendar proofs to be available
        let proofs = [];
        let attempts = 0;
        while(proofs.length == 0) {
            console.log("Sleeping 12 seconds to wait for proofs to generate before doing proof table insertion");
            await new Promise(resolve => setTimeout(resolve, 12000))
            // Calendar proofs from Tierion should now be ready.
            try {
                proofs = await chp.getProofs(proofHandles)
            } catch (err) {
                console.log('caught error getting proofs', err);
                attempts += 1;
                if (attempts < 3) {
                    console.log('retrying...')
                } else {
                    console.error('retry limit exceeded, cancelling proof recording');
                    return;
                }
            }
        }

        // console.log("Proof Objects: Expand objects below to inspect.");
        // console.log(proofs.length, 'proofs loaded');

        const deliveryProofs = [];
        for (let i = 0; i < deliveries.length; i++) {
            const delivery = deliveries[i];
            const proofVal = proofs[i].proof;
            // console.log('proofVal',i, proofVal);
            deliveryProofs.push({
                deliveryId: delivery.id,
                hashValue: hashes[i],
                proofValue: proofVal
            });
        }

        // Should be one generated proof.
        const values = deliveryProofs.map((item) => {
            return `(${item.deliveryId}, '${item.hashValue}', '${item.proofValue}')`;
        });

        const insertQuery = `INSERT INTO proof(deliveryId, hashValue, proofValue) VALUES${values.join(',')} ON CONFLICT DO NOTHING RETURNING *`;
        console.log('proof insertQuery', insertQuery);
        pool.query(insertQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log(err);
                // return res.status(500).json(msg);
            }

            const savedProofs = data.rows;
            console.log('proofs', savedProofs);
            console.log('Saved proofs for ', savedProofs.length, 'proofs');
            // return res.status(200).json(data);
        });
    }

    return {
        matrix: matrix,
        getDistance: getDistance,
        getToday: getToday,
        saveDeliveries: saveDeliveries
    };

})();
module.exports = library;
