const serverList = require('./servers/data.js');
let runingServers = [];

openServer(serverList);

function openServer(servers){
    for(let server in servers){
        if(!servers[server]){
            console.log("No such server as: " + server);
        }else {
            let success = start(servers[server]);
            if(!success){
                restart(runingServers, serverList);
            }
        }
    }
};

async function start(server){
    try{
        let tmp = await server['server'].listen(server['port'], (err)=>{
            if(err) return false;
            else {
                console.log(server['type'] + " server started on port: " + server['port']);
                return true;
            }
        });
        runingServers.push(tmp);
    }catch (e) {
        if(e) return false;
    }
};

function closeServers(servers){
    return new  Promise(resolve => {
        for(let server in servers){
            servers[server].close();
            runingServers = runingServers.filter(serv => {
                return (serv === servers[server]) ? false : true;
            });
        }
        console.log("Servers closed");
        resolve();
    });
}

function restart(runing, toStart){
    console.log("Restarting");
    closeServers(runing).then(()=>{
        setTimeout(()=>{
            openServer(toStart);
        }, 5000);
    });
}

process.on('uncaughtException', (err)=>{
    console.log(err);
    console.log("Rebooting server");
    restart(runingServers, serverList);
});