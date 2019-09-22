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

router.get('/api/massages',(req,res)=>{
    ifAdmin(req.headers.authorization).then(user=>{
        if(req.headers['x-for'] && user.admin){
            getMsg(req.headers['x-for'], req.headers['x-index']).then(ms=>{
                res.json(ms);
            });
        }else {
            getMsg(user.email, req.headers['x-index']).then(ms=>{
                res.json(ms);
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

function getMsg(user, index){
    return new Promise(resolve => {
        fs.readFile(path.join(__dirname, '/../..', 'smtp', 'msgData', user + '.json'), 'utf8', (err,file)=>{
            if(err || !file) resolve([]);
            else {
                let tmp = JSON.parse(file);
                if(!tmp) resolve();
                else {
                    tmp = tmp.filter(msg=>{
                        return msg.spam ? false : true
                    });
                    let msgs = [];
                    const page = 20;
                    for(let i = page;i > 0;i--){
                        msgs.unshift(tmp[tmp.length - i - page * index]);
                    }
                    msgs = msgs.filter(msg=>{
                        return !msg ? false : true
                    });
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