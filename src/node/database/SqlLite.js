const path = require('path');
const fs = require('fs');

function int2ipv4(ipInt){
    return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
}

function ipv42int(ip){
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

module.exports = class SqlLite {
    constructor(config){
        this.config = config;
        this.setup()
    }

    setup(){
        this.bdd = require('better-sqlite3')(path.join(__dirname, '..', '..', '..', 'database', this.config.DATABASE.database), {});
        this.checkVersion();
    }

    checkVersion(){
        if(this.bdd.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='version';").get() != undefined){
            var version = this.bdd.prepare('SELECT * FROM version').get();
            if(version != undefined){
                this.runMigrate(version.version);
            }else{
                this.runMigrate(0);
            }
        }else{
            this.runMigrate(0);
        }
    }

    runMigrate(index){
        const migration_file = new Map();
        const migration_path = path.join(__dirname, '..', '..', 'database_schema', 'sqlite');

        fs.readdirSync(migration_path).forEach(file => {
            migration_file.set(parseInt(file.substr(0, file.indexOf('-'))), path.join(migration_path, file));
        });

        for (let k of migration_file.keys()) {
            if (!(k > index))
            migration_file.delete(k);
            
        }

        new Map([...migration_file.entries()].sort()).forEach((values,keys)=>{
            const sql = fs.readFileSync(values).toString();
            this.bdd.exec(sql);
        })
    }

    addGroup(name){
        var data = {}

        try {
            data.data = this.bdd.prepare("INSERT INTO group_list (name) VALUES (?)").run(name)
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    deleteGroup(id){
        var data = {}

        try {
            data.data = this.bdd.prepare("DELETE FROM group_list WHERE id = ?").run(id);
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    getGroupList(filter){
        var data = {}

        try {
            if(filter != null){
                data.data = this.bdd.prepare("SELECT * FROM group_list WHERE name LIKE ? ORDER BY name ASC").all("*" + filter + "*");
            }else{
                data.data = this.bdd.prepare("SELECT * FROM group_list ORDER BY name ASC").all();
            }
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    getNetworkList(group){
        var data = {}

        try {
            var sqlData = this.bdd.prepare("SELECT * FROM network_list_ipv4 WHERE group_id = ? ORDER BY name ASC").all(group);
            sqlData.forEach(element => {
                element.network = int2ipv4(element.network);
                element.mask = int2ipv4(element.mask);
            });

            data.data = sqlData;
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    getNetwork(id){
        var data = {}

        try {
            var sqlData = this.bdd.prepare("SELECT * FROM network_list_ipv4 WHERE id = ?").get(id);

            sqlData.network = int2ipv4(sqlData.network);
            sqlData.mask = int2ipv4(sqlData.mask);

            data.data = sqlData;
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    deleteNetwork(id){
        var data = {}

        try {
            data.data = this.bdd.prepare("DELETE FROM network_list_ipv4 WHERE id = ?").run(id);
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    addNetwork(name, network, mask, currentGroup){
        var data = {}

        try {
            data.data = this.bdd.prepare("INSERT INTO network_list_ipv4 (group_id, name, network, mask) VALUES (?, ?, ?, ?)").run(currentGroup, name, ipv42int(network), ipv42int(mask));
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    getDeviceList(network){
        var data = {}

        try {
            var mapData = new Map();
            var sqlData = this.bdd.prepare("SELECT * FROM device_list_ipv4 WHERE network_id = ? ORDER BY name ASC").all(network);
            
            sqlData.forEach(element => {
                var ip = element.ip_address;
                element.ip_address = int2ipv4(ip);
                mapData.set(ip, element);
            });
    
            data.data = Object.fromEntries(mapData);
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    getDevice(id){
        var data = {}

        try {
            var sqlData = this.bdd.prepare("SELECT * FROM device_list_ipv4 WHERE id = ?").get(id);

            data.data = sqlData;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    saveDevice(network_id, id, name, ip_address, mac_address){
        var data = {}

        try {
            data.initialData = {
                name: name,
                ip_address: ip_address,
                mac_address: mac_address,
            } ;
            data.data = this.bdd.prepare("INSERT OR REPLACE INTO device_list_ipv4 (id, network_id, name, ip_address, mac_address) VALUES (?, ?, ?, ?, ?)").run(id, network_id, name, ipv42int(ip_address), mac_address.toUpperCase());
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }

    deleteDevice(id){
        var data = {}

        try {
            data.data = this.bdd.prepare("DELETE FROM device_list_ipv4 WHERE id = ?").run(id);
            data.status = 0;
        }catch(error){
            data.status = 1;
            data.error = {};
            data.error.name = error.name;
            data.error.message = error.message;
        }

        return data;
    }
}