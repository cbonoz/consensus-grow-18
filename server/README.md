
AnchorSupply - Routing and API Server
---

### High level endpoint descriptions:

### Assumptions for demo
<ol>
<li>Time windows are infinite (i.e. ports do not close, trucks can arrive at dropoff/pickup locations at any time).</li>
<li>Capacity of trucks is unit size (i.e. each truck after visiting a pickup location is full - this can be easily changed by using a different parameter in the model per truck)</li>
</ol>

### Dev Notes:
<b>Configuration</b><br/><br/>
AnchorSupply uses a postgres database for retaining and querying schedule information. To set up the DB config, add the following to your environment:
<pre>
user = process.env.ANCHOR_SUPPLY_DB_USER // db user name
pass = process.env.ANCHOR_SUPPLY_DB_PASS // db user password
host = process.env.ANCHOR_SUPPLY_HOST // db host
db = process.env.ANCHOR_SUPPLY_DB // db name
</pre>

Prepare the DB by running `init.sql` from the `/models` folder.<br/>
Once this is completed, can load sample data by invoking `node load.js` from `/demo`. This will populate several ports and jobs (in the LA area) that can be routed/visualized within the AnchorSupply Web UI and individual mobile application.

<b>Running the server:</b>
<pre>
yarn && node server.js
</pre>

Run `node demo/load.js` (once the server is running) to populate the server with demo port entities.

<b>Running unit tests:</b>
<pre>
npm install -g mocha
mocha *test.js
</pre>

