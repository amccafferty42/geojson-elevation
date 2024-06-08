# GeoJSON-elevation
Script for adding elevation data to GeoJSON feature collection, leveraging Google's Elevation API.

# Usage
1. Setup a Google Cloud project and copy your API_KEY https://developers.google.com/maps/documentation/elevation/cloud-setup
2. Install Node.js on your local machine https://nodejs.org/en/download/package-manager
3. Clone this repository
4. Run the app `node geojson-elevation.js API_KEY=[YOUR_API_KEY] FILE_PATH=[PATH_TO_YOUR_GEOJSON_FILE]` from the directory you just cloned
5. Elevation in meters will be appended the [2]nd index of each feature's coordinates, following [lat, long, elev]
