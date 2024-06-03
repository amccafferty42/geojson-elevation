const { createServer } = require('node:http');
const https = require('https');
const fs = require("fs");
const express = require('express')

const app = express();
const port = 8080;
// const server = createServer((req, res) => {
//   if (req.url === '/') {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
//   } else if (req.url === '/geojson') {
//     // console.log(req);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end(req);
//       // fs.readFile("./views/index.html", (error, html) => {
//       //     if (error) throw error;
//       //     response.write(html);
//       //     return response.end();
//       // });
//   }
  
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// 1. create a public github repo
// 2. create package.json
// 3. install express
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

app.use(express.json({limit: '50mb'}))    // <==== parse request body as JSON

app.post('/geojson', (req, res) => {
  res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
})

const options = new URL('https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=AIzaSyAX_e65YMJ9sw-Uzz5RlZPK5Dvz9k46lW8');

// const req = https.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// }).end();




// AIzaSyAX_e65YMJ9sw-Uzz5RlZPK5Dvz9k46lW8
// https://maps.googleapis.com/maps/api/elevation/json
//   ?locations=39.7391536%2C-104.9847034
//   &key=YOUR_API_KEY