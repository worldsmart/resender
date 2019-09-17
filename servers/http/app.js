const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

const router = require('./routes/router');
app.all('*', router);

module.exports = app;