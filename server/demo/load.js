/**
 * Createp by cbuonocore on 4/13/18.
 */
const axios = require('axios');
const anchor = require('../anchor');
const colors = require('colors');
const faker = require('faker');
const escape = require('pg-escape');

const jsonexport = require('jsonexport');
//var csv is the CSV file with headers
function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JavaScript object
    // return JSON.stringify(result); //JSON
}

// const uuid = require('uuid');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

const BASE_URL = "http://localhost:9001";
const NUM_ITEMS = 10;

const READ_MANIFEST_FILE = false;

let items = [];
let deliveries = [];

function createFakeLocation() {
    return escape(faker.company.companyName().replace("'", '').replace('"', ''));
}

if (!READ_MANIFEST_FILE) {
    for (let i = 0; i < NUM_ITEMS; i++) {
        const itemName = escape(faker.commerce.productName().replace("'", ''));
        const origin = createFakeLocation();
        const amount = faker.finance.amount();
        const itemDate = faker.date.past();
        const itemId = uuidv4();
        items.push({
            name: itemName,
            unit: parseInt(amount) + " units",
            uuid: itemId,
            metadata: "",
            origin: origin,
            packDate: itemDate
        });
    }

    const content = fs.readFileSync("./locs.json", "utf8");
    deliveries = JSON.parse(content);
    deliveries = deliveries.map((p, i) => {
        p.lat = p.latitude;
        p.lng = p.longitude;
        delete p.latitude;
        delete p.longitude;
        var d = new Date();
        var now = d.getTime() + i;
        p.locationId = i;
        p.timeMs = now;
        p.name = createFakeLocation();
        return p;
    });

    jsonexport(items, function (err, csv) {
        if (err) return console.log(err);
        fs.writeFileSync('./items.csv', csv);
    });

    // console.log(items)
    // write to temp manifest.

} else {
    // Read from a manifest file.
    let content = fs.readFileSync("./items.csv", "utf8");
    items = csvJSON(content);

    content = fs.readFileSync("./deliveries.csv", "utf8");
    deliveries = csvJSON(content);
}

console.log(`Uploading ${items.length} item records from csv`.green);
console.log(`Uploading ${deliveries.length} deliveries from csv`.green);
// console.log('deliveries', deliveries);

const deliveryUrl = `${BASE_URL}/api/deliveries/add`;
const itemUrl = `${BASE_URL}/api/items/add`;
const getItemsUrl = `${BASE_URL}/api/items`

async function loadAll() {
    let data, res;
    try {
        // console.log('itemUrl', itemUrl)
        res = await axios.post(itemUrl, {
            items: items
        });

        data = await axios.get(getItemsUrl);
        itemIds = data.data.map((d) => {
            return d.id;
        }).slice(0, NUM_ITEMS);

        for (let i = 0; i < deliveries.length; i++) {
            deliveries[i].itemId = itemIds[i % NUM_ITEMS];
            if (!READ_MANIFEST_FILE) {
                jsonexport(deliveries, function (err, csv) {
                    if (err) return console.log(err);
                    fs.writeFileSync('./deliveries.csv', csv);
                });
            }
        };

        res = await axios.post(deliveryUrl, {
            deliveries: deliveries
        });

        console.log('Done'.gray)

        // data = await res.json();
        // console.log('deliveries', res)
    } catch (err) {
        console.log(err);
    }

    // res = await axios.post(deliveryUrl, {
    //     deliveries: deliveries
    // })
    // data = await res.json();
    // console.log('deliveries', data);

}

loadAll()