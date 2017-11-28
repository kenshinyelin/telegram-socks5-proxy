const socks5 = require("./lib");
const server = socks5.createServer();

const telegarm = require("./telegram");
telegarm.loadIPList("./telegramip.txt");

server.on("proxyConnect", function (info, socket) {
    var ip = info.host;
    var log = `${socket.remoteAddress} <-> ${ip}:${info.port}`;
    if (!isIP(ip)) {
        socket.destroy();
        console.log(log, "reject");
        return;
    }
    if (!telegarm.isTelegramIP(ip)) {
        socket.destroy();
        console.log(log, "reject");
        return;
    }
    console.log(log, "connect");
});

server.on("proxyError", function (err) {
    console.error("unable to connect to remote server:", err.message);
});

function isIP(str) {
    var ipArray = str.split(".");
    if (ipArray.length != 4) return false;
    for (var item of ipArray) {
        item = parseInt(item);
        if (isNaN(item)) return false;
        if (item >= 1 && item <= 254) continue;
        return false;
    }
    return true;
}

server.listen(65535);