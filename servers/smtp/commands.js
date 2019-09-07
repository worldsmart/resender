module.exports = (data)=>{
    console.log('helo');
    console.log(data);
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
    console.log('from');
    console.log(data);
    let res = '250 | OK ';
    let status = true;
    let d = {};
    const com = data.substring(0, 9).toUpperCase();
    if(com == 'MAIL FROM'){
        let arg = data.substring(9, data.length).replace(' ', '');
        if(arg[0] == ':' && arg[1] == '<' && arg[arg.length - 1] == '>'){
            arg = arg.substring(2, arg.length - 1);
            if(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(arg)){
                d.sender = arg;
            }else {
                status = false;
                res = '553 | The sender adress <' + arg + '> is invalid [RFC-5321].';
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
        next:to
    };
}

function to(data) {
    console.log('to');
    console.log(data);
    let res = '250 | OK';
    let status = true;
    let d = {};
    const com = data.substring(0, 7).toUpperCase();
    if(com == 'RCPT TO'){
        let arg = data.substring(7, data.length).replace(' ', '');
        if(arg[0] == ':' && arg[1] == '<' && arg[arg.length - 1] == '>'){
            arg = arg.substring(2, arg.length - 1);
            if(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(arg)){
                if(arg.split('@')[1] == 'onyame.ml') d.receiver = arg;
                else {
                    status = false;
                    res = '553 | Unsupported mailbox address: ' + arg.split('@')[1];
                }
            }else {
                status = false;
                res = '553 | The receiver adress <' + arg + '> is invalid [RFC-5321].';
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
    console.log('msg');
    console.log(data);
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
    console.log('data');
    console.log(data);
    let ended = false;
    let returneble = data + '\u000D\u000A';
    if(data == '.'){
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