const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const mimeParser = require('./mime_parser.js');

const server = net.createServer((socket) => {
let expectedCommand = require('./commands.js');
    socket.setEncoding('utf8');
    socket.setTimeout(15000);
    let dataString = '';
    let msg = {};
    socket.on('data', (str)=>{
        for(let data in str){
            if(str[data].charCodeAt(0) == 13){
                if(dataString.toUpperCase().split(' ')[0] == 'RSET'){
                    reset(socket);
                }else if (dataString.toUpperCase().split(' ')[0] == 'QUIT' && !msg.data){
                    socket.end('221 | closing connection | bb =B\u000D\u000A');
                }else {
                    let executed = expectedCommand(dataString);
                    if(executed.status == 'close'){
                        socket.end(executed.response);
                    }else if(!executed.status){
                        socket.write(executed.response);
                    }else {
                        if(executed['ended']){
                            mimeParser(msg.data).then(res=>{
                                msg.data = res;
                                msg.id = crypto.randomBytes(16).toString("hex");
                                fs.readFile(path.join(__dirname, '/msg/', msg.receiver.split('@')[0] + '.json'), 'utf8', (err, data)=>{
                                    if(err){
                                        fs.writeFile(path.join(__dirname, '/msg/', msg.receiver.split('@')[0] + '.json'), '['+JSON.stringify(msg)+']', (err)=>{
                                            if(err) socket.write('500 | Fs system error\u000D\u000A');
                                            else {
                                                addMsg(msg.receiver, msg.sender, msg.id);
                                            }
                                            msg = {};
                                            socket.write('250 | Done\u000D\u000A');
                                        });
                                    }else {
                                        let tmp = JSON.parse(data);
                                        tmp.push(msg);
                                        tmp = JSON.stringify(tmp);
                                        fs.writeFile(path.join(__dirname, '/msg/', msg.receiver.split('@')[0] + '.json'), tmp, (err)=>{
                                            if(err) socket.write('500 | Fs system error\u000D\u000A');
                                            else {
                                                addMsg(msg.receiver, msg.sender, msg.id);
                                            }
                                            msg = {};
                                            socket.write('250 | Done\u000D\u000A');
                                        });
                                    }
                                });
                            })

                        }else {
                            for(let a in executed.data){
                                if(msg[a]) msg[a] += executed.data[a];
                                else msg[a] = executed.data[a];
                            }
                            expectedCommand = executed.next;
                            socket.write(executed.response);
                        }
                    }
                }
                dataString = '';
            }else if(str[data].charCodeAt(0) != 10){
                dataString += str[data];
            }
        }
    });

    function reset(socket) {
        expectedCommand = require('./commands.js');
        socket.write('250 | reset | go ahead!\u000D\u000A');
        dataString = '';
        msg = {};
    }
});

function addMsg(mailBox, from, id, subject = '') {
    fs.readFile(path.join(__dirname, 'msgData.json'), 'utf8', (err, data)=>{
        if(!err){
            var tmp = JSON.parse(data);
            tmp.push({
                'id':id,
                'receiver':mailBox,
                'from':from,
                'subject':subject,
                'read':false
            });
            fs.writeFile(path.join(__dirname, 'msgData.json'), JSON.stringify(tmp), (err)=>{});
        }
    });
}

server.on('connection', (socket)=>{
    socket.write('220 | onyame.ml | ESMTP\u000D\u000A');
});

server.on('error', (err) => {
    console.log(err);
});

module.exports = server;