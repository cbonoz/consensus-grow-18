/**
 * Created by cbuonocore on 4/13/18.
 */
// Tests for the anchorSupply.js library.
const assert = require("assert"); // node.js core testing module.
const anchorSupply = require('./anchorSupply');
const fs = require('fs');
const util = require('util');
const _ = require('lodash');

function manhattanDistance(lhs, rhs) {
    return Math.abs(lhs[0] - rhs[0]) + Math.abs(lhs[1] - rhs[1]);
}

describe('anchorSupply', () => {

    it('is ok', function () {
        assert.ok(true);
    });

    it('finds single vehicle routing solution', function (done) {
        const locations = [[0, 0], [0, 1], [0, 2], [0, 3],
            [1, 0], [1, 1], [1, 2], [1, 3],
            [2, 0], [2, 1], [2, 2], [2, 3],
            [3, 0], [3, 1], [3, 2], [3, 3]];
        // Starting location (node) for vehicle.
        const startNode = 0;

        const costMatrix = anchorSupply.getCostMatrix(locations, manhattanDistance);

        const solverOpts = {
            numNodes: locations.length,
            costs: costMatrix
        };

        const searchOpts = {
            computeTimeLimit: 1000,
            depotNode: startNode
        };

        anchorSupply.solveTSP(solverOpts, searchOpts, (err, solution) => {
            console.log(solution);
            assert.equal(solution.length, locations.length - 1, 'Number of locations in route is number of locations without startNode');
            assert.deepEqual(solution, [4, 8, 12, 13, 14, 15, 11, 10, 9, 5, 6, 7, 3, 2, 1], 'expected solution mismatch');
            done();
        });
    });


    it('finds basic multi vehicle routing solution', function (done) {
        const locations = [[0, 0], [0, 1], [1, 0], [1, 1]];
        // Starting location (node) for vehicle.
        const startNode = 0;
        const numVehicles = 2;
        const vehicleCapacity = 2;
        const n = locations.length;

        const costMatrix = anchorSupply.getCostMatrix(locations, manhattanDistance);
        const INF = 1000;

        const solverOpts = {
            numNodes: n,
            costs: costMatrix,
            durations: anchorSupply.matrix(n, n, 1),
            timeWindows: anchorSupply.createArrayList(n, [0, INF]),
            demands: anchorSupply.createDemandMatrix(n, startNode)
        };

        const routeLocks = anchorSupply.createArrayList(numVehicles, []);

        const searchOpts = {
            computeTimeLimit: 1000,
            numVehicles: numVehicles,
            depotNode: startNode,
            timeHorizon: INF,
            vehicleCapacity: vehicleCapacity,
            routeLocks: routeLocks,
            pickups: [1],
            deliveries: [2]
        };

        // console.log(solverOpts, searchOpts);

        anchorSupply.solveVRP(solverOpts, searchOpts, (err, solution) => {
            if (err) {
                console.error('error', err);
                done();
                return;
            }
            console.log('solution', JSON.stringify(solution));
            const routes = solution.routes;
            assert.deepEqual(routes[0], [1, 3, 2], "driver 0");
            assert.deepEqual(routes[1], [], "driver 1");
            done();
        });
    });

    it('finds complex vehicle routing solution', function (done) {
        const content = fs.readFileSync("demo/nodes.json", "utf8");
        const locations = JSON.parse(content);

        console.log('locations', locations.length);

        // Starting location (node) for vehicle.
        const startNode = 0;
        const numVehicles = 5;
        const vehicleCapacity = 5;
        const n = locations.length;

        const costMatrix = anchorSupply.getCostMatrix(locations, anchorSupply.getDistance);
        const INF = 1000000; // also max time horizon.

        const solverOpts = {
            numNodes: n,
            costs: costMatrix,
            durations: costMatrix,
            timeWindows: anchorSupply.createArrayList(n, [0, INF]),
            demands: anchorSupply.createDemandMatrix(n, startNode)
        };

        const routeLocks = anchorSupply.createArrayList(numVehicles, []);

        // Select random subset of pickup/destination indices.
        const indexes = _.range(n);
        const pickups = indexes.slice(0, n/2);
        const deliveries = indexes.slice(n/2);
        // console.log('pickups',pickups.length, pickups);
        // console.log('deliveries', deliveries.length, deliveries);

        const searchOpts = {
            computeTimeLimit: 1000,
            numVehicles: numVehicles,
            depotNode: startNode,
            timeHorizon: INF,
            vehicleCapacity: vehicleCapacity,
            routeLocks: routeLocks,
            pickups: pickups,
            deliveries: deliveries
        };

        // console.log(solverOpts, searchOpts);
        //
        anchorSupply.solveVRP(solverOpts, searchOpts, (err, solution) => {
            if (err) {
                console.error('error', err);
                done();
                return;
            }
            console.log('solution', JSON.stringify(solution));
            done();
        });
    });


});






