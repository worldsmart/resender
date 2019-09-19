const router = require('express').Router();
const path = require('path');
const users = require('./../users');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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

router.get('/api/mail', (req,res)=>{
    jwt.verify(req.headers.authorization, 'q2f5236s', function(err, decoded) {
        if(err || !decoded){
            res.json({err:'Bad token'});
        }
        else {
            const result = getUser(decoded.email, decoded.password);
            if(result){
                fs.readFile(path.join(__dirname, '/../../', 'smtp', 'msgData.json'), 'utf8', (err,mData)=>{
                    if(err || !mData) res.json({err:'Server error'});
                    else {
                        let msgData = JSON.parse(mData);
                        msgData = msgData.filter(msg=>{
                            return msg.id == req.headers['x-onlyfor'] ? true : false
                        });
                        if(msgData && (result[0].email == msgData[0].receiver || result[0].admin)){
                            let file = msgData[0].receiver.match(/(.*)@onyame.ml/i);
                            fs.readFile(path.join(__dirname, '/../../', 'smtp', 'msg', file[1] + '.json'), 'utf8', (err,data)=>{
                                if(err || !data) res.json({err:'Server error'});
                                else {
                                    let tmp = JSON.parse(data);
                                    tmp = tmp.filter(msg=>{
                                        return msg.id == req.headers['x-onlyfor'] ? true : false
                                    });
                                    if(tmp){
                                        if(!msgData[0].read){
                                            let t = JSON.parse(mData);
                                            t.forEach(msg=>{
                                                if(msg.id == req.headers['x-onlyfor']) msg.read = true;
                                            });
                                            fs.writeFile(path.join(__dirname, '/../../', 'smtp', 'msgData.json'), JSON.stringify(t), ()=>{});
                                        }
                                        res.json(tmp[0]);
                                    }else res.json({err:'No such email'});
                                }
                            })
                        }else res.json({err:'Access denied'});
                    }
                });
            }
            else res.json({err:'Bad user'});
        }
    });
});

router.get('/api/get_mails', (req,res)=>{
    ifAdmin(req.headers.authorization).then(r=>{
        if(r){
            let check = getUser(r);
            if(check){
                fs.readdir(path.join(__dirname, '../', '../', 'smtp', 'msg'), (err,files)=>{
                    if(err || !files) res.json({err:'server error'});
                    else {
                        for(let a in files){
                            files[a] = {
                                mailbox:files[a].match(/(.*)\.json/i)[1] + '@onyame.ml',
                                subject:'Mailbox',
                                link:'mailboxes/'+ files[a].match(/(.*)\.json/i)[1]
                            };
                        }
                        files = {data:files};
                        files['admin'] = true;
                        res.json(files);
                    }
                });
            }else res.json({err:'wrong user'});
        }else{

        }
    });
});

router.get('/api/get_posts',(req,res)=>{
    ifAdmin(req.headers.authorization).then(r=>{
        if(r){
            returnMails(req.headers['x-onlyfor']).then(data=>{
                res.json(data);
            });
        }else{
            res.json({err:'wrong user'});
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

function returnMails(mailbox) {
    return new Promise(resolve => {
        fs.readFile(path.join(__dirname, '/../../', 'smtp', 'msgData.json'), 'utf8', (err,data)=>{
            if(err || !data)resolve([]);
            else {
                let tmp = JSON.parse(data);
                tmp = tmp.filter(mail=>{
                    return mail.receiver == mailbox + '@onyame.ml' ?  true : false
                });
                resolve(tmp);
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
                if(decoded.admin){
                    resolve({admin:true,data:decoded});
                }else resolve({admin:false,data:decoded});
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