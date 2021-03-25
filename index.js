require('dotenv').config();
const PORT = 3000;

const express = require('express');
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const cors = require('cors');
server.use(cors());

const apiRouter = require('./api');
server.use('/api', apiRouter);

const client = require('./db/client');


server.listen(PORT, function () {
    console.log('CORS-enabled web server listening on port 3000')
    client.connect();
});