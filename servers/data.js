const serverList = {
    "http":{
        "server":require('./http/redirect.js'),
        "type":'HTTP',
        "port":80
    },
    "https":{
        "server":require('./https/app.js'),
        "type":'HTTPS',
        "port":443
    },
    "smtp":{
        "server":require('./smtp/app.js'),
        "type":'SMTP',
        "port":25
    }
};
module.exports = serverList;