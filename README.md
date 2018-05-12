AnchorSupply
---

<b>Team Brontosaurus:</b>
<br/>

* Chris Buonocore (back end / maps)
* Ed Arenberg (iOS)
* Brandon In (research / back end)
* Sarah Han (UI / UX / front end)

<b>Check the `README.md` files in each subfolder for more information.</b>

### Concept:

90 percent of short-haul trucking from maritime ports in the US are performed by individual truckers or small fleets of less than 6 vehicles. They are at the mercy of brokers who charge 25-35% fees, and dole out single-transaction jobs on an unknown schedule. This causes most trucks to return to the ports empty, and idle needlessly waiting for jobs.

AnchorSupply is a new service that eliminates the broker, and implements a routing algorithm that emphasizes dual-transaction routes - delivery from port to hub followed by a hub pickup and return to port. Drivers will have more full loads and daily trips, ports will be able to transact more containers per day, and port pollution will be reduced. Routing is performed regularly to self-heal from truck breakdowns or driver issues.

View the pitch deck here: <a href="https://docs.google.com/presentation/d/1rC6jKaGLiJJWgyQHkIo4bEdZeTz1ex22JDnd4DLX3EQ/edit?usp=sharing">Pitch Deck</a>

### Structure

<ul>
<li><b>/server</b>: Server and api for submitting scheduling data.</li>
<li><b>/AnchorSupplyApp</b>: Mobile app designed for providing schedule/ information specific to each driver.</li>
<li><b>/AnchorSupplyWeb</b>: Client side reactjs website</li>
<li><b>/screenshots</b>: Screenshots of app</b></li>  
</ul>

### Screenshots


<div width="400" style="text-align:center">
    <h3>AnchorSupply Home Page</h3>
        <img src="./screenshots/home.png" width="600" style="margin: 0 auto"/>
    <h3>Detailed Routing (Expanded View)</h3>
        <img src="./screenshots/map_routes.png" width="600" style="margin: 0 auto"/>
    <h3>Map Route Page showing 50 jobs (pickup/delivery pairs)</h3>
        <img src="./screenshots/map.png" width="600" style="margin: 0 auto"/>
    <h3>API Documentation</h3>
        <img src="./screenshots/api.png" width="600" style="margin: 0 auto"/>
    <h3>API Documentation (Detailed View)</h3>
        <img src="./screenshots/api_single.png" width="600" style="margin: 0 auto"/>
    <h3>Mobile App Screenshots</h3>
        <img src="./screenshots/ip-job.png" width="600" style="margin: 0 auto"/>
        <img src="./screenshots/ip-map.png" width="600" style="margin: 0 auto"/>
</div>


### TODO:

* Create Logo. X
* Update pitch deck in drive folder. X
* Create API documentation. Understand the api interfaces and json body formats. X
* Finish 3 core API routes: add port, add job, query schedule.X
* Add master google maps page to website. X
* Research - what is the schedule data format that ports use. What kind of data will we most likely have access to, and how can this be inserted into this framework for pathfinding: https://github.com/mapbox/node-or-tools X
* Create basic marketing website UI design / or use framework that allows plugging in an API doc page. X
* Add tests to server code and routing. X
* Check jobs table for duplicates. X

### Dev Notes
<b>Check the `README.md` files in each subproject for how to start services.</b>