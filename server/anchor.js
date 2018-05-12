/**
 * Created by cbuonocore on 4/13/18.
 */
const library = (function () {

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

    async function saveDelivery(delivery, pool) {
        const hashValue = hash(delivery);
        // A few sample SHA-256 proofs to anchor
        // const hashes = ['1d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a',
        //     '2d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a',
        //     '3d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a'
        // ]
        const hashes = [hashValue];

        // Submit each hash to three randomly selected Nodes
        let proofHandles = await chp.submitHashes(hashes)
        console.log("Submitted Proof Objects: Expand objects below to inspect.")
        console.log(proofHandles)

        // Wait for Calendar proofs to be available
        console.log("Sleeping 12 seconds to wait for proofs to generate...")
        await new Promise(resolve => setTimeout(resolve, 12000))

        // Calendar proofs from Tierion should now be ready.
        let proofs = await chp.getProofs(proofHandles)
        console.log("Proof Objects: Expand objects below to inspect.");
        console.log(proofs);

        // Should be one generated proof.
        const proof = proofs[0];
        const deliveryId = delivery.id;
        // Store the calendar promise in the proofs DB.
        const insertQuery = `INSERT INTO proof() VALUES(${deliveryId}, '${hashValue}', '${proof}')`;
        console.log('proof insertQuery', insertQuery);
        pool.query(insertQuery, [], (err, data) => {
            if (err) {
                const msg = JSON.stringify(err);
                console.log('error inserting proof', err);
                // TODO: add retry in case of error.
                // return res.status(500).json(msg);
            }

            // return res.status(200).json(data);
        });
    }

    return {
        matrix: matrix,
        getDistance: getDistance,
        getToday: getToday,
    };

})();
module.exports = library;
