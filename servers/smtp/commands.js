module.exports = (data)=>{
    let res = '250 | onyame.ml | hello ';
    let status = true;
    let d = {};
    const com = data.substring(0, 4).toUpperCase();
    if(com == 'HELO' || com == 'EHLO'){
        let cData = data.split(' ');
        if(cData.length > 2){
            status = 'close';
            res = '501 | HELO/EHLO argument "' + data.substring(data.indexOf(' ') + 1, data.length) + '" is invalid, closing connection.';
        }else {
            if(!cData[1]){
                status = 'close';
                res = '501 | Empty HELO/EHLO argument not allowed, closing connection.';
            }else {
                res += cData[1];
                d.addres = cData[1];
            }
        }
    }else {
        status = false;
        res = '502 | Bad sequense of commands || unrecognized command';
    }
    res += '\u000D\u000A';
    return {
        status:status,
        data:d,
        response:res,
        next:from
    };
};

function from(data) {
    let res = '250 | OK ';
    let status = true;
    let d = {};
    const com = data.substring(0, 9).toUpperCase();
    if(com == 'MAIL FROM'){
        let arg = data.substring(9, data.length).replace(' ', '');
        if(arg[0] == ':' && arg[1] == '<' && arg[arg.length - 1] == '>'){
            arg = arg.substring(2, arg.length - 1);
                d.sender = arg;
        }else {
            status = false;
            res = '555 | Syntax error.';
        }

    }else {
        status = false;
        res = '502 | Bad sequense of commands || unrecognized command';
    }
    res += '\u000D\u000A';
    return {
        status:status,
        data:d,
        response:res,
        next:to
    };
}

function to(data) {
    let res = '250 | OK';
    let status = true;
    let d = {};
    const com = data.substring(0, 7).toUpperCase();
    if(com == 'RCPT TO'){
        let arg = data.substring(7, data.length).replace(' ', '');
        if(arg[0] == ':' && arg[1] == '<' && arg[arg.length - 1] == '>'){
            arg = arg.substring(2, arg.length - 1);
                if(arg.split('@')[1] == 'onyame.ml') d.receiver = arg;
                else {
                    status = false;
                    res = '553 | Unsupported mailbox address: ' + arg.split('@')[1];
                }
        }else {
            status = false;
            res = '555 | Syntax error.';
        }

    }else {
        status = false;
        res = '502 | Bad sequense of commands || unrecognized command';
    }
    res += '\u000D\u000A';
    return {
        status:status,
        data:d,
        response:res,
        next:msg
    };
}

function msg(data) {
    let res = '250 | Msg body : | use line with "." to end entering';
    let status = true;
    let d = {};
    const com = data.substring(0, 4).toUpperCase();
    if(com != 'DATA'){
        status = false;
        res = '502 | Bad sequense of commands || unrecognized command';
    }
    res += '\u000D\u000A';
    return {
        status:status,
        data:d,
        response:res,
        next:bodyHendler
    };
}

function bodyHendler(data){
    let ended = false;
    let returneble = data + '\u000D\u000A';
    if(data == '.' || 'QUIT'){
        ended = true;
        returneble = '';
    }
    return {
        status:true,
        data:{data:returneble},
        response:'',
        next:bodyHendler,
        ended: ended
    };
}