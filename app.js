const express = require('express');
const https = require('https');

const app = express();
const port = 8080;

let allCoordinates = [];
let allElevations = [];

app.listen(port, () => {
    console.log(`GeoJSON Elevation listening on port ${port}`);
});

app.use(express.json({limit: '50mb'}));

app.post('/geojson', async (req, res) => {
    const updatedGeoJSON = await processGeoJSON(req);
    res.json(updatedGeoJSON.body);
});

async function processGeoJSON(geoJSON) {
    const elevationRequests = generateElevationAPIRequests(geoJSON);
    for (request of elevationRequests) {
        await getElevations(request);
    }
    return appendElevation(geoJSON);
}

function appendElevation(request) {
    let i = 0;
    for (feature of request.body.features) {
        if (feature.geometry != undefined && feature.geometry.coordinates != undefined) {
            for (coordinates of feature.geometry.coordinates) {
                coordinates[2] = allElevations[i];
                i++;
            }
        }
    }
    return request;
}

function generateElevationAPIRequests(request) {
    let optionsString = "https://maps.googleapis.com/maps/api/elevation/json?";
    let locationsString = "locations=";
    const elevationRequests = [];
    for (feature of request.body.features) {
        if (feature.geometry != undefined && feature.geometry.coordinates != undefined) {
            for (coordinates of feature.geometry.coordinates) {
                allCoordinates.push(coordinates[0]);
                allCoordinates.push(coordinates[1]);
                locationsString = locationsString + coordinates[0] + "," + coordinates[1] + "|";

                // Google Elevation API limit per request is 512 coordinates
                if (allCoordinates.length % 1024 == 0) {
                    locationsString = locationsString.slice(0, locationsString.length - 1);
                    optionsString = optionsString + locationsString + "&key=AIzaSyAX_e65YMJ9sw-Uzz5RlZPK5Dvz9k46lW8";
                    options = new URL(optionsString);

                    elevationRequests.push(options);

                    optionsString = "https://maps.googleapis.com/maps/api/elevation/json?";
                    locationsString = "locations=";
                }
            }
        }
    }

    // Create one final request URL with the remaining coordinates
    if (locationsString != "locations=") {
        locationsString = locationsString.slice(0, locationsString.length - 1);
        optionsString = optionsString + locationsString + "&key=AIzaSyAX_e65YMJ9sw-Uzz5RlZPK5Dvz9k46lW8";
        options = new URL(optionsString);
        elevationRequests.push(options);
    }
    return elevationRequests;
}

async function getElevations(options) {
    return new Promise((resolve, reject) => {
        let body = '';
        https.request(options, async function(elevationAPIResponse) {
            console.log('STATUS: ' + elevationAPIResponse.statusCode);
            console.log('HEADERS: ' + JSON.stringify(elevationAPIResponse.headers));
            elevationAPIResponse.setEncoding('utf8');
            for await (const chunk of elevationAPIResponse) {
                body += chunk;
            }
            extractElevations(JSON.parse(body));
            resolve();
        }).end();
    });
}

function extractElevations(body) {
    for (result of body.results) {
        allElevations.push(result.elevation);
    }
}