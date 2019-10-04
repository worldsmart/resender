const fs = require('fs');
const https = require('https');
const path = require('path');
const privateKey  = fs.readFileSync(path.join(__dirname, 'cert', 'private.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'cert', 'certificate.crt'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, 'cert', 'ca_bundle.crt'), 'utf8');

const credentials = {key: privateKey, cert: certificate, ca: ca};

module.exports = https.createServer(credentials, require('../http/app'));