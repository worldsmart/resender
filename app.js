const express = require('express');
const app = express();

const HTTPport = 8080;
const SMTPport = 25;

app.get('*', (req,res)=>{
    res.send('Hello world!')
});

app.listen(HTTPport,()=>{
    console.log("HTTP server runing on port: " + HTTPport);
});


const net = require('net');
const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('STATUS: 230 | onyame.ml | ESMTP\u000D\u000A');
}).on('error', (err) => {
    console.log(err);
});

server.listen(SMTPport ,() => {
    console.log('SMTP server runing on port: ' + SMTPport);
});