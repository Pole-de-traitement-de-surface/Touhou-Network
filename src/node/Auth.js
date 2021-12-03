const ActiveDirectory = require('activedirectory');

module.exports = class Auth {
    constructor(config){
        this.config = config;
        if(this.config.LDAP_AUTH.enable){
            var config = { url: this.config.LDAP_AUTH.url,
                baseDN: this.config.LDAP_AUTH.baseDN,
                username: this.config.LDAP_AUTH.username,
                password: this.config.LDAP_AUTH.password }
            this.ad = new ActiveDirectory(config);
        }
    }

    auth(username, password){
        var self = this;
        if(this.config.LDAP_AUTH.enable){
            return new Promise((resolve, reject) => {
                self.ad.findUser(username, function(err, user) {
                    if (err) {
                        reject({
                            status: false,
                            err: err
                        });
                        return;
                    }
                
                    if(!user){ 
                        reject({
                            status: false,
                            msg: 'User: ' + username + ' not found.'
                        });
                        return;
                    }else{
                        self.ad.authenticate(user.cn, password, function(err, auth) {
                            if (err) {
                                reject({
                                    status: false,
                                    err: err
                                });
                                return;
                            }
                            
                            if (auth) {
                                self.ad.getGroupMembershipForUser(username, function(err, groups) {
                                    if (err) {
                                        reject({
                                            status: false,
                                            err: err
                                        });
                                        return;
                                    }
                                
                                    if (!groups){
                                        reject({
                                            status: false,
                                            msg: 'User: ' + username + ' not found.'
                                        });
                                        return;
                                    }else{
                                        if(groups.filter(group => group.cn == self.config.LDAP_AUTH.group).length == 1){
                                            resolve({
                                                status: true,
                                                msg: 'Authenticated!',
                                                name: user.cn
                                            });
                                        }else{
                                            resolve({
                                                status: false,
                                                msg: 'Access denied for ' + user.cn
                                            });
                                        }
                                    }
                                });
                            }else {
                                reject({
                                    status: false,
                                    msg: 'Authentication failed!'
                                });
                                return;
                            }
                        });
                    }
                });
                
            });
        }else{
            return new Promise((resolve, reject) => {
                if(username == self.config.CREDENTIAL.username && password == self.config.CREDENTIAL.password){
                    resolve({
                        status: true,
                        msg: 'Authenticated!',
                        name: "Admin"
                    });
                }else{
                    reject({
                        status: false,
                        msg: 'Authentication failed!'
                    });
                }
            });
        }
    }
}