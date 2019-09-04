const express = require('express');
const app = express();

const port = 8080;

app.get('*', (req,res)=>{
    res.send('Hello world!')
});

app.listen(port,()=>{
    console.log("HTTP server runing on port: " + port);
});


const net = require('net');
const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('STATUS: 230 | onyame.ml | ESMTP\u000D\u000A');
}).on('error', (err) => {
    console.log(err);
});

server.listen(25 ,() => {
    console.log('SMTP server runing on port: 25');
});