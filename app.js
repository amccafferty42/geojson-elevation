const express = require('express');

const app = express();
const port = 8080;

let coordinates = [];

app.listen(port, () => {
    console.log(`GeoJSON Elevation listening on port ${port}`);
});

app.use(express.json({limit: '50mb'}));

app.post('/geojson', (req, res) => {
    for (feature of req.body.features) {
        if (feature.geometry && feature.geometry.coordinates) {
            for (coordinatePair of feature.geometry.coordinates) {
                coordinates.push(coordinatePair);
                console.log(coordinatePair);
            }
        }
    }
  res.json({requestBody: coordinates});
});

//const options = new URL('https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=');

// const req = https.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// }).end();

// fs.readFile("./views/index.html", (error, html) => {
//     if (error) throw error;
//     response.write(html);
//     return response.end();
// });

// https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=YOUR_API_KEY