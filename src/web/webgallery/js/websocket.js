var socketIsReady = false;

var socket = io();

socket.on('connect', function() {
    console.log("Successfully connected!");
    socket.emit('connect_init', (callback) => {
        socketIsReady = true;
        window.dispatchEvent(new Event('SocketInit'));
    });
});

function socket_auth(username, password, callback){
    if(socketIsReady){
        socket.emit('auth', username, password, (ack) => {
            callback(ack);
        });
    }
}