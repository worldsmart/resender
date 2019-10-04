const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const forceSsl = require('express-force-ssl');

app.use(bodyParser.json());
app.use(forceSsl);
app.use(express.static(path.join(__dirname, 'dist')));

const router = require('./routes/router');
app.all('*', router);

module.exports = app;