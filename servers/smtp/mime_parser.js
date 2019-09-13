module.exports = (data)=>{
    return new Promise(resolve => {
        data = splitData(data);
        sortData(data).then(res=>{
            resolve(res);
        });
    });
};

function sortData(data){
    return new Promise(resolve => {
        let res = {
            html:'',
            text:'',
            headers:{
                from:{},
                to:'',
                subject:'',
                date:''
            },
            attachments:[]
        };
        if(typeof data == 'string') data = [data];
        let tmp = data[0].match(/Subject:\s*.*\r\n/g);
        if(tmp){
            tmp = tmp[0];
            res.headers.subject = tmp.substring(tmp.indexOf(':') + 1 , tmp.length - 2);
        }
        tmp = data[0].match(/From:\s*.*\r\n/g);
        if(tmp){
            tmp = tmp[0];
            tmp = tmp.substring(tmp.indexOf(':') + 1 , tmp.length - 2);
            if(tmp.indexOf('<')){
                res.headers.from['adress'] = tmp.substring(tmp.indexOf('<') + 1, tmp.indexOf('>'));
                res.headers.from['name'] = ' ' + ' ' + tmp.substring(0, tmp.indexOf('<'));
                res.headers.from['name'] += tmp.substring(tmp.indexOf('>') + 1, tmp.length);
                res.headers.from['name'] = res.headers.from['name'].trim();
            }else {
                res.headers.from['name'] = tmp.trim();
            }
        }
        tmp = data[0].match(/Date:\s*.*\r\n/g);
        if(tmp){
            tmp = tmp[0];
            res.headers['date'] = tmp.substring(tmp.indexOf(':') + 1 , tmp.length - 2).trim();
        }
        tmp = data[0].match(/To:\s*.*\r\n/g);
        if(tmp){
            tmp = tmp[0];
            res.headers['to'] = tmp.substring(tmp.indexOf(':') + 1 , tmp.length - 2).trim();
        }
        data.forEach(item=>{
            if(item.match(/Content-Type:\s*text\/plain\s*;/g)){
                let t = item.substring(item.match(/\r\n\r\n.*/).index , item.length);
                if(t)
                    res.text = t.trim();
            }
            if(item.match(/Content-Type:\s*text\/html\s*;/g)){
                let t = item.match(/\r\n\r\n.*\r\n\r\n/g);
                if(t) res.html = t[0].trim();
            }
            if(item.match(/Content-Disposition:\s*attachment\s*;/g)){
                let t ={
                    name:'',
                    type:'',
                    encoding:'',
                    buffer:''
                }
                let r = item.match(/filename\s*=\s*".*"/g);
                if(r) t.name = r[0].substring(r[0].indexOf('"') + 1, r[0].length - 1).trim();
                r = item.match(/Content-Transfer-Encoding\s*:\s*.*\s*\r\n/g);
                if(r) t.encoding = r[0].substring(r[0].indexOf(':') + 1, r[0].length).trim();
                r = item.match(/Content-Type\s*:\s*.*\s*;/g);
                if(r) t.type = r[0].substring(r[0].indexOf(':') + 1, r[0].length).trim();
                r = item.substring(item.match(/\r\n\r\n/).index + 4, item.length - 2).split('\r\n').join('').trim();
                t.buffer = r;
                res.attachments.push(t);
            }
        });
        resolve(res);
    });
}

function splitData(data) {
    const spliter = data.match(/boundary\s*=\s*".*"/g);
    if(spliter){
        spliter.forEach(sp=>{
            sp = '--' + sp.substring(sp.indexOf('"') + 1, sp.length - 1);
            if(typeof data == 'string'){
                data = data.split(sp);
            }else {
                for (let a in data) {
                    let tmp = data[a].split(sp);
                    tmp .forEach(d=>{
                        data.push(d);
                    });
                    data[a] = undefined;
                }
            }
        });
        data = data.filter(conn => {
            return (conn == undefined) ? false : true;
        });
    }
    return data;
}