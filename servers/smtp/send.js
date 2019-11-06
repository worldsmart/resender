const nodemailer = require('nodemailer');
const dns = require('dns');

module.exports = (msg)=>{
    return new Promise(resolve => {
        dns.resolve(msg.to.substring(msg.to.indexOf('@') + 1), 'MX', (err,records)=>{
            let transporter = nodemailer.createTransport({
                host: /*'localhost'*/ records[0].exchange,
                port: 25,
                secure: true
            });

            msg.dkim = {
                domainName: "onyame.ml",
                keySelector: "def",
                privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC99xS8h8HwXjRw87zWCX7n/kglCWbXUlDqDM2x7Y4j7NrudkZr
mUJheQSH7EXQAqY8bZh+sc9jKBvXvaGuY17GjRURHC1P9Rzhp55ZKmd+bHnoZjNW
uUG2D19YghdOfb7KGZcBZO4zlswI+koqnhJJCEOOhj3A9pMtH4dru055QQIDAQAB
AoGAZoL9V7fS+ol7tzBwyPga2cqo2AO40Z2EOKlsHwZY3B4nDuQYoFv2LG+H+GmS
SuwDFTz3O/dsONAeJlAY/eh17bV1g85ov3WTqM0vytSVj9fNqNRS/rsWDnMEM1XE
XAV2Bt2+iIbOKNK6HkSx/erlLiOh3eZY3ouFAeBwA+k5JSECQQDj4iL+IisXZUoU
FzM1iPSwtPSPclOiQp2F1UJ0RBz16WcsTKCi+n7YfzGOvnabC76JqtDoac/u28q8
PgtvN/ztAkEA1WdFPdiMFgZ5u5FIPFrST+r+c2X4z3k22D9D+dHZQAMLi1efZATg
748nfMz2PQ5+9v0ksUeX4HjRfWAS6GA3JQJAWzsEIVOShspBLuvez3bl5vx60BbI
DrS2lYa8FQnTwktPx7dhs/2u3IOHVos/tnCsNjcRbYo2+Xw6nMQGFd+HPQJBAINQ
W5wVzwWSkH+pg0CYRkek+1P5EGRiWywvqd1kkoFAHm9syIicM+lVNmAmIvMpI1lK
JbTsr/kRfx7d6mSRJ/0CQQCl8sklb9NN4fjoJuEHmU/q0US20q28p8ahIae80gOp
afb6TM2oREwxHSlDE6LsJnXjj/MQVS2NoSunCECoJNF5
-----END RSA PRIVATE KEY-----`
            };

            transporter.sendMail(msg, (err, msg)=>{
                if(!err) resolve(true);
                else resolve();
            });
        });
    })
};