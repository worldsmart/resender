const express = require('express');
const app = express();

app.get('*', (req,res)=>{
    res.send('Hello world!')
});

app.listen(80,()=>{
    console.log('HTTP app is runing on port: 80');
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