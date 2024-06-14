const https = require('https');
const fs = require('fs');

const BASE_URL = "https://maps.googleapis.com/maps/api/elevation/json?";
const API_KEY = process.argv[2].match("API_KEY=") ? process.argv[2].slice(8) : undefined;
const FILE_PATH = process.argv[3].match("FILE_PATH=") ? process.argv[3].slice(10) : undefined;

let allElevations = [];

if (API_KEY && FILE_PATH) {
    console.info("API_KEY=" + API_KEY);
    console.info("FILE_PATH=" + FILE_PATH);
    readFile();
} else {
    console.error("Usage: `node geojson-elevation.js API_KEY=[YOUR_API_KEY] FILE_PATH=[PATH_TO_YOUR_GEOJSON_FILE]`");
}

function readFile() {
    fs.readFile(FILE_PATH, 'utf8', (error, data) => {
        if (error) {
            console.error('An error occurred while reading the file:', error);
            return;
        }
        console.log('File has been read successfully');
        write(JSON.parse(data));
    });
}

async function write(geoJSON) {
    let updatedGeoJSON = await processGeoJSON(geoJSON);
    updatedGeoJSON = JSON.stringify(updatedGeoJSON);
    fs.writeFile(FILE_PATH, updatedGeoJSON, 'utf8', (error) => {
        if (error) {
            console.error('An error occurred while writing to the file:', error);
            return;
        }
        console.log('File has been written successfully');
    });
}

async function processGeoJSON(geoJSON) {
    const elevationRequests = generateElevationAPIRequests(geoJSON);
    for (request of elevationRequests) {
        await getElevations(request);
    }
    return appendElevation(geoJSON);
}

function appendElevation(request) {
    let i = 0;
    for (feature of request.features) {
        if (feature.geometry != undefined && feature.geometry.coordinates != undefined) {
            if (Array.isArray(feature.geometry.coordinates[0])) {
                for (coordinates of feature.geometry.coordinates) {
                    coordinates[2] = allElevations[i];
                    i++;
                }
            } else {
                feature.geometry.coordinates[2] = allElevations[i];
                i++;
            }
        }
    }
    return request;
}

function generateElevationAPIRequests(request) {
    let elevationRequests = [];
    let numCoordinatePairs = 0;
    let locationsString = "";
    for (feature of request.features) {
        if (feature.geometry != undefined && feature.geometry.coordinates != undefined) {
            if (Array.isArray(feature.geometry.coordinates[0])) {
                for (coordinates of feature.geometry.coordinates) {
                    numCoordinatePairs++;
                    coordinates[0] = coordinates[0].toString().length > 12 ? coordinates[0].toFixed(12) : coordinates[0];
                    coordinates[1] = coordinates[1].toString().length > 12 ? coordinates[1].toFixed(12) : coordinates[1];
                    locationsString = locationsString + coordinates[1] + "," + coordinates[0] + "|";
                    if (numCoordinatePairs == 512) {
                        elevationRequests.push(getRequestUrl(locationsString.slice(0, locationsString.length - 1)));
                        numCoordinatePairs = 0;
                        locationsString = "";
                    }
                }
            } else {
                numCoordinatePairs++;
                feature.geometry.coordinates[0] = feature.geometry.coordinates[0].toString().length > 12 ? feature.geometry.coordinates[0].toFixed(12) : feature.geometry.coordinates[0];
                feature.geometry.coordinates[1] = feature.geometry.coordinates[1].toString().length > 12 ? feature.geometry.coordinates[1].toFixed(12) : feature.geometry.coordinates[1];
                locationsString = locationsString + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[1] + "|";
                if (numCoordinatePairs == 512) {
                    elevationRequests.push(getRequestUrl(locationsString.slice(0, locationsString.length - 1)));
                    numCoordinatePairs = 0;
                    locationsString = "";
                }
            }
        }
    }
    // Create one final request URL with the remaining coordinates
    if (numCoordinatePairs > 0) {
        elevationRequests.push(getRequestUrl(locationsString.slice(0, locationsString.length - 1)));
    }
    return elevationRequests;
}

function getRequestUrl(locations) {
    return new URL(BASE_URL + "locations=" + locations + "&key=" + API_KEY);
}

async function getElevations(options) {
    console.log("Google Elevation API Request");
    return new Promise((resolve) => {
        let body = '';
        https.request(options, async function(elevationAPIResponse) {
            console.log('STATUS: ' + elevationAPIResponse.statusCode);
            console.log('HEADERS: ' + JSON.stringify(elevationAPIResponse.headers));
            if (elevationAPIResponse.error_message || elevationAPIResponse.statusCode != 200) {
                console.log('ERROR_MESSAGE: ' + elevationAPIResponse.error_message);
                console.log(options);
                process.exit(1);
            }
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