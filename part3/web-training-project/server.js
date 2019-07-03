/* eslint-disable prettier/prettier */
// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
const cors = require('cors');


app = express();
app.use(serveStatic(__dirname + "/dist"));


if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("/dist"));
}
// app.get("*", (req, res) => {
//     console.log("yo I am here", res);
//     res.setHeader("Access-Control-Allow-Origin", 'http://myDomain:8080');
//     res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
//     res.sendFile(path.resolve(__dirname, "dist", "index.html"));
// });

var port = process.env.PORT || 5000;
app.listen(port);

console.log("server started " + port);