const serverList = {
    "http":{
        "server":require('./http/app.js'),
        "type":'HTTP',
        "port":80
    },
    "smtp":{
        "server":require('./smtp/app.js'),
        "type":'SMTP',
        "port":25
    }
};
module.exports = serverList;