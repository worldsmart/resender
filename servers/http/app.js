const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const MailParser = require("mailparser-mit").MailParser;

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client', 'index.html'))
});

module.exports = app;