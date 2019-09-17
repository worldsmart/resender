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
                                subject:'Mailbox'
                            };
                            files = {data:files};
                            files['admin'] = true;
                            res.json(files);
                        }
                    }
                });
            }else res.json({err:'wrong user'});
        }else{

        }
    });
});

router.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
});

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