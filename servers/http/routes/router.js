const router = require('express').Router();
const path = require('path');
const users = require('./../users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multiparty = require('multiparty');
const sender = require('./../../smtp/send.js');

router.post("/api/send" , (req,res)=>{
    req.body.attachments = [];
    const form = new multiparty.Form();
    form.on('error', function(err) {
        console.log('Error parsing form: ' + err.stack);
    });
    form.on('field', function(name,value) {
        req.body[name] = value;
    });
    form.on('file', function(name,value) {
        req.body.attachments.push({
            content: fs.readFileSync(value.path, 'base64'),
            filename:value.originalFilename,
            encoding: 'base64'
        });
    });
    form.on('close', function() {
        req.body.tls = {rejectUnauthorized: false};
        sender(req.body).then(r=>{
            res.json({"success":r});
        });
    });
    form.parse(req);
});

router.post("/api/server_login" , (req,res)=>{
    if(req.body.email && req.body.password){
        const result = getUser(req.body.email, req.body.password);
        if(result[0]){
            res.json({email:req.body.email, jwt:jwt.sign(result[0], 'q2f5236s')});
        }else res.json({'err':"Wrong email or password"});
    }else res.json({'err':"Bad data"});
});

router.get('/api/authorization', (req,res)=>{
    jwt.verify(req.headers.authorization, 'q2f5236s', function(err, decoded) {
        if(err || !decoded){
            res.json({success:false});
        }
        else {
            const result = getUser(decoded.email, decoded.password);
            if(result){
                res.json({
                    success:true,
                    user:{
                        email: decoded.email,
                        jwt:req.headers.authorization
                    }
                });
            }
            else res.json({success:false});
        }
    });
});

router.get('/api/massages',(req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(req.headers['x-for'] && user.admin){
            getMsg(req.headers['x-for'], req.headers['x-index'], req.headers['x-filter'], req.headers['x-type']).then(ms=>{
                res.json(ms);
            });
        }else {
            getMsg(user.email, req.headers['x-index'], req.headers['x-filter'],req.headers['x-type']).then(ms=>{
                res.json(ms);
            });
        }
    });
});

router.get('/api/mailboxes',(req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(user.admin){
            fs.readdir(path.join(__dirname, '/../..', 'smtp', 'msgData'), (err,file)=>{
                if(err || !file) res.json({'err':'reading error'});
                else {
                    res.json(file);
                }
            });
        }else {
            res.json({'err':'access denied'});
        }
    });
});

router.get('/api/deleteMsg', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i=>{
                return i ? true : false
            });
            if(user.admin && req.headers['x-for']){
                user.email = req.headers['x-for'];
            }
            if(req.headers['x-index'][0]){
                fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=>{
                    if(err || !file)res.json({'err':'no file'});
                    else {
                        let tmp = JSON.parse(file);
                        tmp = tmp.filter(row=>{
                            for(let i = 0; i < req.headers['x-index'].length;i++){
                                if(row.id == req.headers['x-index'][i]) return false;
                            }
                            return true;
                        });
                        fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp),(err)=>{
                            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msg', user.email + '.json'), 'utf8', (err,f)=>{
                                let t = JSON.parse(f);
                                t = t.filter(row=>{
                                    for(let i = 0; i < req.headers['x-index'].length;i++){
                                        if(row.id == req.headers['x-index'][i]) return false;
                                    }
                                    return true;
                                });
                                fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msg', user.email + '.json'), JSON.stringify(t),(err)=>{
                                    res.json({'err':false});
                                });
                            });
                        });
                    }
                });
            }else res.json({'err':true});
        }
    });
});

router.get('/api/addToSpam', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i=>{
                return i ? true : false
            });
            if(user.admin && req.headers['x-for']){
                user.email = req.headers['x-for'];
            }
            if(req.headers['x-index'][0]){
                fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=> {
                    if (err || !file)res.json({'err':true});
                    else {
                        let tmp = JSON.parse(file);
                        tmp.forEach(msg=>{
                            req.headers['x-index'].forEach(id=>{
                                if(msg.id == id) msg.spam = true;
                            });
                        });
                        fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp), err=>{
                            if (err || !file)res.json({'err':true});
                            else {
                                fs.readFile(path.join(__dirname, '/../..', 'smtp', 'spam', user.email + '.json'), 'utf8', (err,file)=> {
                                    tmp = tmp.filter(m=>{
                                        for(let i =0;i < req.headers['x-index'].length;i++){
                                            if(m.id == req.headers['x-index'][i]) return true;
                                        }
                                        return false
                                    });
                                    let t = [];
                                    tmp.forEach(m=>{
                                        t.push({"address":m.from.substring(m.from.indexOf('<') + 1, m.from.indexOf('>'))});
                                    });
                                    if (err || !file){
                                        fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'spam', user.email + '.json'), JSON.stringify(t),err=>{
                                            if(err) res.json({'err':true});
                                            else res.json({'err':false});
                                        });
                                    }
                                    else {
                                        let f = JSON.parse(file);
                                        t.forEach(a=>{
                                            for(let i = 0;i < f.length;i++){
                                                if(f[i].address == a.address) continue;
                                            }
                                                f.push(a);
                                        });
                                        fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'spam', user.email + '.json'), JSON.stringify(t),err=>{
                                            if(err) res.json({'err':true});
                                            else res.json({'err':false});
                                        });
                                    }
                                });
                            }
                        })
                    }
                });
            }else res.json({'err':true});
        }
    });
});

router.get('/api/mark', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i => {
                return i ? true : false
            });
            if (user.admin && req.headers['x-for']) {
                user.email = req.headers['x-for'];
            }
            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=> {
                if(err || !file) res.json({'err':true});
                else {
                    let tmp = JSON.parse(file);
                    tmp.forEach(msg=>{
                        req.headers['x-index'].forEach(index=>{
                            if(msg.id == index){
                                msg['marked'] = true;
                            }
                        });
                    });
                    fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp), err=>{
                        if(err) res.json({'err':true});
                        else res.json({'err':false});
                    });
                }
            });
        }
    });
});

router.get('/api/read', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i => {
                return i ? true : false
            });
            if (user.admin && req.headers['x-for']) {
                user.email = req.headers['x-for'];
            }
            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=> {
                if(err || !file) res.json({'err':true});
                else {
                    let tmp = JSON.parse(file);
                    tmp.forEach(msg=>{
                        req.headers['x-index'].forEach(index=>{
                            if(msg.id == index){
                                msg['read'] = true;
                            }
                        });
                    });
                    fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp), err=>{
                        if(err) res.json({'err':true});
                        else res.json({'err':false});
                    });
                }
            });
        }
    });
});

router.get('/api/unmark', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i => {
                return i ? true : false
            });
            if (user.admin && req.headers['x-for']) {
                user.email = req.headers['x-for'];
            }
            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=> {
                if(err || !file) res.json({'err':true});
                else {
                    let tmp = JSON.parse(file);
                    tmp.forEach(msg=>{
                        req.headers['x-index'].forEach(index=>{
                            if(msg.id == index){
                                msg['marked'] = false;
                            }
                        });
                    });
                    fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp), err=>{
                        if(err) res.json({'err':true});
                        else res.json({'err':false});
                    });
                }
            });
        }
    });
});

router.get('/api/removeFromSpam', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(!user || !req.headers['x-index']){
            res.json({'err':true});
        }else {
            req.headers['x-index'] = req.headers['x-index'].split(',');
            req.headers['x-index'] = req.headers['x-index'].filter(i => {
                return i ? true : false
            });
            if (user.admin && req.headers['x-for']) {
                user.email = req.headers['x-for'];
            }
            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), 'utf8', (err,file)=>{
                if(err || !file) res.json({'err':true});
                else {
                    let tmp = JSON.parse(file);
                    tmp.forEach(m=>{
                        for(let i = 0;i < req.headers['x-index'].length;i++){
                            if(req.headers['x-index'][i] == m.id) m.spam = false;
                        }
                    });
                    fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user.email + '.json'), JSON.stringify(tmp), err=>{
                        if(err || !file) res.json({'err':true});
                        else {
                            tmp = tmp.filter(m=>{
                                for(let i = 0;i < req.headers['x-index'].length;i++){
                                    if(req.headers['x-index'][i] == m.id) return true;
                                }
                                return false;
                            });
                            let t = [];
                            tmp.forEach(msg=>{
                               t.push(msg.from.substring(msg.from.indexOf('<') + 1, msg.from.indexOf('>')));
                            });
                            fs.readFile(path.join(__dirname, '/../..', 'smtp', 'spam', user.email + '.json'), 'utf8', (err,f)=>{
                                if(err || !file) res.json({'err':true});
                                else {
                                    let spamers = JSON.parse(f);
                                    spamers = spamers.filter(spamer=>{
                                        for(let i = 0;i < t.length;i++){
                                            if(t[i] == spamer.address) return false;
                                        }
                                        return true;
                                    });
                                    fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'spam', user.email + '.json'), JSON.stringify(spamers), (err)=>{
                                        if(err || !file) res.json({'err':true});
                                        else res.json({'err':false});
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/api/massage', (req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(user.admin && req.headers['x-for']){
            getSingle(req.headers['x-for'], req.headers['x-id']).then(msg=>{
                if(!msg) res.json({'err':'Can`t get massage'});
                else res.json(msg);
            });
        }
        else {
            getSingle(user.email, req.headers['x-id']).then(msg=>{
                if(!msg) res.json({'err':'Can`t get massage'});
                else res.json(msg);
            });
        }
    });
});

router.get('/api/get_admin', (req,res)=>{
    ifAdmin(req.headers.authorization).then(r=>{
        if(r.admin) res.json({success:true});
        else res.json({success:false});
    });
});

router.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
});

function getSingle(owner, id) {
    return new Promise(resolve => {
        fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msg', owner + '.json'), 'utf8', (err,file)=>{
            if(err || !file) resolve();
            else {
                let tmp = JSON.parse(file);
                tmp = tmp.filter(m=>{
                    return m.id == id ? true : false
                });
                if(tmp[0]){
                    tmp = tmp[0];
                    fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', owner + '.json'), 'utf8', (err,f)=>{
                        let t = JSON.parse(f);
                        t.forEach(msg=>{
                            if(msg.id == id){
                                msg.read = true;
                            }
                        });
                        fs.writeFile(path.join(__dirname, '/../..', 'smtp', 'msgData', owner + '.json'), JSON.stringify(t),()=>{});
                    });
                    resolve(tmp);
                }else resolve();
            }
        });
    });
}

function getMsg(user, index, filter, type){
    return new Promise(resolve => {
        fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user + '.json'), 'utf8', (err,file)=>{
            if(err || !file) resolve([]);
            else {
                let tmp = JSON.parse(file);
                if(!tmp) resolve();
                else {
                    if(type == 'default'){
                        tmp = tmp.filter(msg=>{
                            return msg.spam ? false : true
                        });
                    }else if(type == 'new'){
                        tmp = tmp.filter(msg=>{
                            return !msg.spam && !msg.read ? true : false
                        });
                    }else if(type == 'marked'){
                        tmp = tmp.filter(msg=>{
                            return msg.marked ? true : false
                        });
                    }
                    else if(type == 'spam'){
                        tmp = tmp.filter(msg=>{
                            return msg.spam ? true : false
                        });
                    }
                    if(filter){
                        tmp = tmp.filter(msg=>{
                            if(msg.from.match(filter)) return true;
                            else if(msg.subject.match(filter)) return true;
                            else return false;
                        });
                    }
                    let msgs = [];
                    const page = 20;
                    for(let i = page;i > 0;i--){
                        msgs.unshift(tmp[tmp.length - i - page * index]);
                    }
                    msgs = msgs.filter(msg=>{
                        return !msg ? false : true
                    });
                    for(let i =0;i < msgs.length;i++){
                        msgs[i].date = msgs[i].date.substring(0, msgs[i].date.indexOf('T')) /*+ ' ' + msgs[i].date.substring(msgs[i].date.indexOf('T')+ 1, msgs[i].date.indexOf('.'))*/;
                    }
                    resolve({lengthMsg:tmp.length,data:msgs});
                }
            }
        });
    });
}

function ifAdmin(token) {
    return new Promise(resolve =>{
        jwt.verify(token, 'q2f5236s', function(err, decoded) {
            if(err || !decoded){
                resolve(false);
            }else {
                let user = getUser(decoded.email, decoded.password);
                if(!user[0]){
                    resolve(false)
                }
                else resolve(user[0])
            }
        });
    });
}

function getUser(email, password){
    return  users.filter(user => {
        return (user.email == email && user.password == password) ? true : false;
    });
}

module.exports = router;