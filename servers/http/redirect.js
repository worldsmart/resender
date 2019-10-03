const express = require('express');
const app = express();


app.all('*', (req,res)=>{
    res.redirect('https://onyame.ml/');
});

module.exports = app;