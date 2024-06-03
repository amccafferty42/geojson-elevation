const { createServer } = require('node:http');
const https = require('https');
const fs = require("fs");

const hostname = '127.0.0.1';
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

const express = require('express')

app.use(express.json())    // <==== parse request body as JSON

app.listen(8080)

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