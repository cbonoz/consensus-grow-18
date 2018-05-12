/**
 * Created by cbuonocore on 4/13/18.
 */
const library = (function () {

    const geolib = require('geolib');
    // const geoLib = require('geo-lib');
    const ortools = require('node_or_tools');
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
        for(let i = 0; i < n; i++) {
            result.push(new Array(m).fill(fillValue));
        }
        return result;
    }

    function getToday() {
        const date = new Date();
        return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }

    function createDemandMatrix(n, startNodeIndex) {
        const m = matrix(n, n, 1);
        for (let i = 0; i < n; i++) {
            m[startNodeIndex][i] = 0;
        }
        return m;
    }

    function createArrayList(n, val) {
        const result = [];
        for (let i = 0; i < n; i++) {
            if (val) {
                result.push(val);
            } else {
                result.push([]);
            }
        }
        return result;
    }

    /**
     * Multi-vehicle node visit optimization
     * @param vrpSolverOpts options for solving port vrp.
     * @param vrpSearchOpts options for searching port vrp solution.
     * @param cb: (err, solution) => { ... }
     */
    function solveVRP(vrpSolverOpts, vrpSearchOpts, cb) {
        const VRP = new ortools.VRP(vrpSolverOpts);
        VRP.Solve(vrpSearchOpts, cb);
    }

    /**
     * Single-vehicle node visit optimization
     * @param tspSolverOpts options for solving port tsp.
     * @param tspSearchOpts options for searching port tsp.
     * @param cb: (err, solution) => { ... }
     */
    function solveTSP(tspSolverOpts, tspSearchOpts, cb) {
        const TSP = new ortools.TSP(tspSolverOpts);
        TSP.Solve(tspSearchOpts, cb);
    }

    function getCostMatrix(locations, costFunction) {
        const costMatrix = new Array(locations.length);
        for (let from = 0; from < locations.length; ++from) {
            costMatrix[from] = new Array(locations.length);
            for (let to = 0; to < locations.length; ++to) {
                costMatrix[from][to] = costFunction(locations[from], locations[to]);
            }
        }
        return costMatrix;
    }

    return {
        matrix: matrix,
        getDistance: getDistance,
        createArrayList: createArrayList,
        createDemandMatrix: createDemandMatrix,
        getCostMatrix: getCostMatrix,
        getToday: getToday,
        solveVRP: solveVRP,
        solveTSP: solveTSP
    };

})();
module.exports = library;

