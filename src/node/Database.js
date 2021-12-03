const path = require('path');
const fs = require('fs');

module.exports = class Database {
    constructor(config){
        this.config = config;
        this.setup()
    }

    setup(){
        
        var dir = path.join(__dirname, '..', '..', 'database');
        
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                this.setupSQLITE();
                break;
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                process.exit(1);
        }
    }

    setupSQLITE(){
        const SqlLite = require('./database/SqlLite.js');
        this.sqlLite = new SqlLite(this.config);
    }

    addGroup(name){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.addGroup(name);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    deleteGroup(id){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.deleteGroup(id);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    getGroupList(filter){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.getGroupList(filter);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    getNetworkList(group){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.getNetworkList(group);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    getNetwork(id){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.getNetwork(id);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    deleteNetwork(id){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.deleteNetwork(id);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    addNetwork(name, network, mask, currentGroup){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.addNetwork(name, network, mask, currentGroup);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    getDeviceList(network){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.getDeviceList(network);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    getDevice(id){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.getDevice(id);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    saveDevice(network_id, id, name, ip_address, mac_address){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.saveDevice(network_id, id, name, ip_address, mac_address);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

    deleteDevice(id){
        switch(this.config.DATABASE.type) {
            case 'SQLITE':
                return this.sqlLite.deleteDevice(id);
            case 'MYSQL':
                console.log('MYSQL');
            case 'MARIADB':
                console.log('MARIADB');
                break;
            default:
                return;
        }
    }

};