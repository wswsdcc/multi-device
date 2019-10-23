const io = require('socket.io')();
const chokidar = require('chokidar');
var fileMng = require('../fileManager');

const watcher = chokidar.watch('public/uploads', {
    // ignored: /(^|[\/\\])\../,
    // persistent: false,
    // ignoreInitial: true,
    // cwd: '.', // 表示当前目录
    // depth: 0, // 只监听当前目录不包括子目录
    // alwaysStat: true,
    // awaitWriteFinish: {
    //     stabilityThreshold: 2000,
    //     pollInterval: 250
    // },
});

watcher.on('add', (path, stats) => {
    if (stats) {
        console.log('文件名:', path);
        tempStringPath = path;
        var index1 = path.lastIndexOf(".");
        var index2 = path.length;
        var suffix = path.substring(index1 + 1, index2);//后缀名
        if (suffix === 'pdf') {
            io.emit('filelist', {filelist:[path]})
        }
    }
})

function DevManager() {
    this.socketIoPeers = {};
    this.idBase = 0;
}

DevManager.prototype.addSocketIoPeer = function addSocketIoPeer(socketioId, deviceSize) {
    console.log("adding socketio peer " + socketioId);
    this.socketIoPeers[socketioId] = {
        'id': socketioId,
        'size': deviceSize.deviceSize
    };
};

DevManager.prototype.deleteSocketIoPeer = function deleteSocketIoPeer(id) {
    delete this.socketIoPeers[id];
};

DevManager.prototype.startSocketIoServer = function startSocketIoServer(port) {

    //Start the Socketio Server
    io.listen(port);

    var devMng = this;

    io.on('connection', function (socket) {
        var id = socket.id;

        console.log('user connected ' + socket.id);
        socket.emit("deviceid", { id: id });

        var filelist = fileMng.getJsonFile('./public/uploads')
        socket.emit("filelist", { filelist: filelist });

        socket.on("user ready", function (deviceSize) {
            devMng.addSocketIoPeer(id, deviceSize);
            io.sockets.emit("userlist", { connDevs: devMng.socketIoPeers });
            socket.broadcast.emit('pageTurning', 1);
            console.log(devMng.socketIoPeers)
        });

        socket.on("pageTurning", function (curPage) {
            socket.broadcast.emit('pageTurning', curPage);
        })

        socket.on("fileViewChange", function (data) {
            socket.broadcast.emit('fileViewChange', data);
        })

        socket.on('disconnect', function (reason) {
            //TODO: handle disconnect
            var deviceId;
            //There should be exactly one object in socketIoPeers with socketioId === socket.id
            for (var peer in devMng.socketIoPeers)
                if (devMng.socketIoPeers[peer] && devMng.socketIoPeers[peer].id === socket.id) {
                    deviceId = peer;
                }

            devMng.deleteSocketIoPeer(deviceId); //delete peer that disconnected
            io.sockets.emit("userlist", { connDevs: devMng.socketIoPeers });
            if (deviceId) {
                console.log('user ' + deviceId + ' disconnected ');
                console.log('disconnect reason ' + reason);
            } else
                console.log('peer was not in socketIoPeers --> TODO:check logic');
        });        

        // socket.on('wrapMsg', function(msg){
        //     //console.log('message: ' + msg + ' for ' + msg.receiver);
        //     var connRec = devMng.socketIoPeers[msg.receiver];
        //     if(connRec !== undefined)
        //         io.sockets.connected[connRec.socketioId].emit('wrapMsg', msg); //send message only to interestedDevice
        //     else {
        //         var err = {
        //             eventTag : 'error',
        //             sender : msg.receiver,
        //             type : "peer-unavailable",
        //             message : "the peer you wanted to connect to is not available"
        //         };
        //         //Could also send close...
        //         io.sockets.connected[this.id].emit('wrapMsg', err);
        //         console.log(msg.sender + ' tried to send a message to ' + msg.receiver + ' which is not connected -> error');
        //     }
        // });

        socket.on('error', function (err) {
            console.log('socket Error: ' + err);
        });

    });
};

DevManager.prototype.idIsFree = function (id) {
    return (!this.peers[id]);
};

DevManager.prototype.start = function (portSocketIo) {
    this.startSocketIoServer(portSocketIo);
};

module.exports = DevManager;