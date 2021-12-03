const { Server } = require("socket.io");


module.exports = class WebSocket {
    constructor(server, database, auth){
        this.server = server;
        this.database = database;
        this.auth = auth;

        this.io = new Server(this.server.server);
        this.setup();
    }

    setup(){
        var self = this;

        this.io.use((socket, next) => {
            this.server.session(socket.request, {}, next);
        });

        this.io.on('connection', (socket) => {
            const session = socket.request.session;
            console.log('a user connected');

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('connect_init', (ack) => {
                if(typeof ack == "function"){
                    ack();
                }
            });

            socket.on('auth', (username, password, ack) => {
                self.auth.auth(username, password).then(function(data) {
                    session.isConnected = data.status;
                    session.user = data.name;
                    session.save();

                    if(typeof ack == "function"){
                        
                        ack(data);
                    }
                }).catch(function(error){
                    console.log(error);
                    if(typeof ack == "function"){
                        ack(null);
                    }
                });
            })

            socket.on('add_group', (name,  ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.addGroup(name));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('delete_group', (id,  ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.deleteGroup(id));
                    }else{
                        ack("unauthorized");
                    }
                }
            })
            
            socket.on('get_group_list', (filter, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.getGroupList(filter));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('get_network_list', (group, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.getNetworkList(group));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('get_network', (id, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.getNetwork(id));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('delete_network', (id, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.deleteNetwork(id));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('add_network', (name, network, mask, currentGroup, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.addNetwork(name, network, mask, currentGroup));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('get_device_list', (filter, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.getDeviceList(filter));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('get_device', (filter, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.getDevice(filter));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('save_device', (network_id, id, name, ip_address, mac_address, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.saveDevice(network_id, id, name, ip_address, mac_address));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

            socket.on('delete_device', (id, ack) => {
                if(typeof ack == "function"){
                    if(session.isConnected){
                        ack(self.database.deleteDevice(id));
                    }else{
                        ack("unauthorized");
                    }
                }
            })

        });
    }
};