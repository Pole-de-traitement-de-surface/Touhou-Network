const Config = require('./node/Config.js');
const Database = require('./node/Database.js');
const Auth = require('./node/Auth.js');
const Server = require('./node/Server.js');
const WebSocket = require('./node/WebSocket.js');

var config = new Config().config;
var database = new Database(config);
var auth = new Auth(config);
var server = new Server(config, database);
var webSocket = new WebSocket(server, database, auth);

server.listen();

if(process.argv.includes("--install")){
    setTimeout(function() {
        process.exit(0)
    }, 5000);
}
