module.exports = (data)=>{
    return new Promise(resolve => {
        resolve(parseData(getHeaders(data)));
    });
};

function parseData(data){
    let res = {};
    if(data.headers){
        res['headers'] = splitHeaders(data.headers);
        const splitter = data.body.match(/boundary\s*=\s*"(.*)"\r\n/ig);
        if(splitter){
            splitter.forEach(sp=>{
                sp = sp.match(/"(.*)"/i);
                if(sp){
                    if(typeof data.body == 'string'){
                        data.body = data.body.split('--' + sp[1]);
                    }else {
                        for(let a in data.body){
                            data.body[a].split('--' + sp[1]).forEach(spt=>{
                                data.body.push(spt);
                            });
                            data.body[a] = undefined;
                        }
                    }
                }
            });
            data.body = data.body.filter(conn => {
                return (conn == undefined) ? false : true;
            });
        }else data.body = [data.body];
        data.body.forEach(item=>{
            if(item.match(/Content-Disposition:\s*attachment\s*;/g)){
                let t ={
                    name:'',
                    type:'',
                    encoding:'',
                    buffer:''
                };
                let r = item.match(/filename\s*=\s*".*"/g);
                if(r) t.name = r[0].substring(r[0].indexOf('"') + 1, r[0].length - 1).trim();
                r = item.match(/Content-Transfer-Encoding\s*:\s*.*\s*\r\n/g);
                if(r) t.encoding = r[0].substring(r[0].indexOf(':') + 1, r[0].length).trim();
                r = item.match(/Content-Type\s*:\s*.*\s*;/g);
                if(r) t.type = r[0].substring(r[0].indexOf(':') + 1, r[0].length).trim();
                r = item.substring(item.match(/\r\n\r\n/).index + 4, item.length - 2).split('\r\n').join('').trim();
                t.buffer = r;
                if(res['attachments']) res['attachments'].push(t);
                else {
                    res['attachments'] = [];
                    res['attachments'].push(t);
                }
            }else if(item.match(/Content-Type:\s*text\/plain\s*;/g)){
                let t = item.substring(item.match(/\r\n\r\n.*/).index , item.length);
                if(t)
                    res.text = t.trim();
            }else if(item.match(/Content-Type:\s*text\/html\s*;/g)){
                let t = item.substring(item.match(/\r\n\r\n.*/).index , item.length);
                if(t) res.html = t.trim();
            }
        });
        return res;
    } else {
        res.text = data.body;
        return res;
    }
}

function splitHeaders(headers) {
    let splited = {
        from:{
            name:'',
            address:''
        },
        to:'',
        subject:'',
        date:''
    };
    let from = headers.match(/From:.*<.*>\r\n/i);
    if(from){
        from = from[0];
        const address = from.match(/<(.*)>/i);
        if(address) splited.from.address = address[1];
        const name = from.match(/:\s*(.*)\s*</i);
        if(name) splited.from.name = name[1].trim();
    }
    const to = headers.match(/To:\s+?\s*(.*)\r\n/i);
    if (to) splited.to = to[1];
    const subject = headers.match(/Subject:\s+?\s*(.*)\r\n/i);
    if (subject) splited.subject = subject[1];
    const date = headers.match(/Date:\s+?\s*(.*)\r\n/i);
    if (date) splited.date = date[1];
    return splited;
}

function getHeaders(data){
    const multipart = data.match(/Content-Type:\s*multipart\/.*;\s*boundary=\s*".*"/i);
    if(multipart){
        return {
            headers:data.substring(0, multipart.index),
            body:data.substring(multipart.index, data.length)
        }
    }else{
        return {
            headers:undefined,
            body:data
        }
    }
}