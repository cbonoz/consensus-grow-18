/**
 * Createp by cbuonocore on 4/13/18.
 */
const axios = require('axios');
const anchor = require('../anchor');
const faker = require('faker');
// const uuid = require('uuid');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

const BASE_URL = "http://localhost:9001";
const NUM_ITEMS = 10;
const items = []
for (let i = 0; i < NUM_ITEMS; i++) {
    const itemName = faker.commerce.productName()
    const origin = faker.company.companyName();
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

// console.log(items)

const content = fs.readFileSync("./nodes.json", "utf8");
let deliveries = JSON.parse(content);
deliveries = deliveries.map((p, i) => {
    p.lat = p.latitude;
    p.lng = p.longitude;
    delete p.latitude;
    delete p.longitude;
    p.name = `Delivery ${i % NUM_ITEMS + 1}`;
    var d = new Date();
    var now = d.getTime();
    p.locationId = i;
    p.timeMs = now;
    return p;
});

// console.log('deliveries', deliveries);

const deliveryUrl = `${BASE_URL}/api/deliveries/add`;
const itemUrl = `${BASE_URL}/api/items/add`;
const getItemsUrl = `${BASE_URL}/api/items`

async function loadAll() {
    let data, res;
    try {
        console.log('itemUrl', itemUrl)
        res = await axios.post(itemUrl, {
            items: items
        });

        data = await axios.get(getItemsUrl);
        itemIds = data.data.map((d) => {
            return d.id;
        }).slice(0, NUM_ITEMS);

        for (let i = 0; i < deliveries.length; i++) {
            deliveries[i].itemId = itemIds[i % NUM_ITEMS];
        };

        res = await axios.post(deliveryUrl, {
            deliveries: deliveries
        });

        // data = await res.json();
        console.log('deliveries', res)
      } catch(err) {
        console.log(err);
      }

    // res = await axios.post(deliveryUrl, {
    //     deliveries: deliveries
    // })
    // data = await res.json();
    // console.log('deliveries', data);

}

loadAll()