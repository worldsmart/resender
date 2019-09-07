const net = require('net');
let expectedCommand = require('./commands.js');

const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.setTimeout(15000);
    let dataString = '';
    let msg = {};
    socket.on('data', (str)=>{
        for(let data in str){
            if(str[data].charCodeAt(0) == 13){
                if(dataString.toUpperCase().split(' ')[0] == 'RSET'){
                    reset(socket);
                }else if (dataString.toUpperCase().split(' ')[0] == 'QUIT'){
                    socket.end('221 | closing connection | bb =B\u000D\u000A');
                }else {
                    let executed = expectedCommand(dataString);
                    if(executed.status == 'close'){
                        socket.end(executed.response);
                    }else if(!executed.status){
                        socket.write(executed.response);
                    }else {
                        if(executed['ended']){
                            console.log('ended');
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

server.on('connection', (socket)=>{
    socket.write('230 | onyame.ml | ESMTP\u000D\u000A');
});

server.on('error', (err) => {
    console.log(err);
});

module.exports = server;