const path = require('path');
const fs   = require('fs');
const yaml = require('js-yaml');

module.exports = class Config {
    constructor(){
        this.configPath = path.join(__dirname, '../../conf/config.yml');
        this.load();
    }

    load(){
        try {
            this.config = yaml.load(fs.readFileSync(this.configPath, 'utf8'));
          } catch (e) {
            console.log(e);
            process.exit(1)
          }
    }
};