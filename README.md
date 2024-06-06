# GeoJSON-elevation
Quick and dirty service for adding elevation data to a GeoJSON feature collection

# Usage
1. Setup a Google Cloud project https://developers.google.com/maps/documentation/elevation/cloud-setup
2. Copy the generated API_KEY
3. Install Node.js on your local machine https://nodejs.org/en/download/package-manager
4. Clone this repository
5. Run `node geojson-elevation.js API_KEY=[YOUR_API_KEY]` from the directory you just cloned
6. Send a POST request to `http://127.0.0.1:8080/geojson` with a GeoJSON included in the body of the request
7. Elevation in meters will be appended the [2]nd index of each feature's coordinates, following [lat, long, elev]
