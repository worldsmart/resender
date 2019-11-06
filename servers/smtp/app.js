const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const MailParser = require("mailparser-mit").MailParser;

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
                            socket.end('250 | OK\u000D\u000A');
                            msg.id = crypto.randomBytes(16).toString("hex");
                            let mailparser = new MailParser();
                            mailparser.on("end", function(mail){
                                msg.data = mail;
                                fs.readFile(path.join(__dirname, 'spam', msg.receiver.substring(0, msg.receiver.indexOf('@')) + '.json'), 'utf8', (err, file)=>{
                                    if(err){
                                        saveMsg(msg);
                                    }
                                    else {
                                        let tmp = JSON.parse(file);
                                        tmp = tmp.filter((spamer)=>{
                                            return spamer.address == msg.sender ? true : false
                                        });
                                        if(tmp[0]) {
                                            msg.spam = true;
                                            saveMsg(msg);
                                        }else {
                                            saveMsg(msg);
                                        }
                                    }
                                });
                            });
                            mailparser.write(msg.data);
                            mailparser.end();
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

function saveMsg(massage) {
    fs.readFile(path.join(__dirname, 'msgData', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), 'utf8', (err, file)=>{
        let msgData = {
            to:massage.data.to[0].name + ' <' + massage.data.to[0].address + '>',
            from:massage.data.from[0].name + ' <' + massage.data.from[0].address + '>',
            id:massage.id,
            subject:massage.data.subject,
            date:massage.data.date,
            read:false,
            spam:massage.spam
        };
        if(err){
            fs.writeFile(path.join(__dirname, 'msgData', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), '[' + JSON.stringify(msgData) + ']', err=>{
                if(err) return;
                else msg(massage);
            });
        }
        else {
            let tmp = JSON.parse(file);
            tmp.push(msgData);
            fs.writeFile(path.join(__dirname, 'msgData', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), JSON.stringify(tmp), err=>{
                if(err) return;
                else msg(massage);
            });
        }
    });
    function msg(massage) {
        fs.readFile(path.join(__dirname, 'msg', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), 'utf8', (err, file)=>{
            let msgData = {
                server:massage.addres,
                to:massage.data.to[0].name + ' <' + massage.data.to[0].address + '>',
                from:massage.data.from[0].name + ' <' + massage.data.from[0].address + '>',
                id:massage.id,
                subject:massage.data.subject,
                date:massage.data.date,
                html:massage.data.html,
                text:massage.data.text,
                attachments:massage.data.attachments
            };
            if(err){
                fs.writeFileSync(path.join(__dirname, 'msg', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), '[' + JSON.stringify(msgData) + ']');
            }
            else {
                let tmp = JSON.parse(file);
                tmp.push(msgData);
                fs.writeFileSync(path.join(__dirname, 'msg', massage.receiver.substring(0, massage.receiver.indexOf('@')) + '.json'), JSON.stringify(tmp));
            }
        });
    }
}

server.on('connection', (socket)=>{
    socket.write('220 | onyame.ml | ESMTP\u000D\u000A');
});

server.on('error', (err) => {
    console.log(err);
});

module.exports = server;