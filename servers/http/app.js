const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const MailParser = require("mailparser-mit").MailParser;

app.get('/', (req,res)=>{
    let msg = {};
    fs.readdir(path.join(__dirname, '/../', 'smtp', '/msg'), (err, files)=>{
            if(err) msg = [{'err':'No directory'}];
            else {
                files.forEach((fileName)=>{
                    let tmp = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', 'smtp', '/msg', fileName), 'utf8'));
                    msg[fileName.substring(0, fileName.indexOf('.json'))] = tmp;
                });
                res.json(msg);
            }
    });
});

module.exports = app;