/**
 * Created by cbuonocore on 4/14/18.
 * https://github.com/mapbox/node-or-tools/blob/master/API.md#vrp
 */
const assert = require("assert"); // node.js core testing module.
const anchorSupply = require('./anchorSupply');
const fs = require('fs');
const util = require('util');
const _ = require('lodash');

const INF = 100000000;

const content = fs.readFileSync("demo/nodes.json", "utf8");
let locations = JSON.parse(content);
locations = locations.splice(0, 25);
// const locations = [
    // [13.414649963378906, 52.522905940278065],
    // [13.363409042358397, 52.549218541178455],
    // [13.394737243652344, 52.55062769982075],
    // [13.426065444946289, 52.54640008814808],
    // [13.375682830810547, 52.536534077147714],
    // [13.39010238647461, 52.546191306649376],
    // [13.351736068725584, 52.50754964045259],
    // [13.418254852294922, 52.52927670688215],
// ];


console.log('locations', locations.length);

// Starting location (node) for vehicle.
const depotIndex = 0;
const computeTimeLimit = 10000;
const numVehicles = 10;
const vehicleCapacity = 2;
const n = locations.length;

// 9am -- 5pm
var dayStarts = 0;
var dayEnds = 8 * 60 * 60;

const costs = anchorSupply.getCostMatrix(locations, anchorSupply.getDistance);

// Dummy durations, no service times included
var durations = costs;

// Dummy time windows for the full day
var timeWindows = new Array(durations.length);

for (var at = 0; at < durations.length; ++at) {
    timeWindows[at] = [dayStarts, dayEnds];
}

var demands = anchorSupply.createDemandMatrix(n, depotIndex);

// No route locks per vehicle, let solver decide freely
var routeLocks = anchorSupply.createArrayList(numVehicles, []);


var solverOpts = {
    numNodes: durations.length,
    costs: costs,
    durations: durations,
    timeWindows: timeWindows,
    demands: demands
};

var timeHorizon = INF; //dayEnds - dayStarts;

var searchOpts = {
    computeTimeLimit: computeTimeLimit,
    numVehicles: numVehicles,
    depotNode: depotIndex,
    timeHorizon: timeHorizon,
    vehicleCapacity: vehicleCapacity,
    routeLocks: routeLocks,
    pickups: [],
    deliveries: []
};

// console.log(solverOpts, searchOpts);
//
anchorSupply.solveVRP(solverOpts, searchOpts, (err, solution) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('solution', JSON.stringify(solution));
});
