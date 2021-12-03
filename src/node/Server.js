const path = require('path');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const session = require('express-session')
const favicon = require('serve-favicon');

module.exports = class Server {
    constructor(config, database){
        this.path = path.join(__dirname, '../web');
        this.config = config;
        this.database = database;
        this.server = server;
        this.setup();
    }

    setup(){
        if(this.config.SERVER.SESSION.store.type == "SQLITE"){
            const sqlite = require("better-sqlite3");
            const SqliteStore = require("better-sqlite3-session-store")(session)
            const db = new sqlite(path.join(__dirname, '../../database', "sessions.sqlite"), {});

            this.store = new SqliteStore({
                client: db, 
                expired: {
                  clear: this.config.SERVER.SESSION.store.expired.clear,
                  intervalMs: this.config.SERVER.SESSION.store.expired.intervalMs
                }
            })
        }else{
            const MemoryStore = require('memorystore')(session)

            this.store = new MemoryStore({
                checkPeriod: this.config.SERVER.SESSION.store.checkPeriod
            });
        }
        
        this.session = session({
            cookie: this.config.SERVER.SESSION.cookie,
            store: this.store,
            resave: this.config.SERVER.SESSION.resave,
            secret: this.config.SERVER.SESSION.secret
        });
        app.use(this.session);
          
        app.set('view engine', 'ejs');
        app.set('views', path.join(this.path, 'views'));

        app.get('/', function(req, res) {
            if(!req.session.isConnected){
                res.redirect('/login');
                return;
            }
            
            res.render('pages/index', {
                page: 'home',
                session: req.session,
                head: {
                    title: 'Touhou Network'
                }
            });
        });

        app.get('/login', function(req, res) {
            if(req.session.isConnected){
                res.redirect('/');
                return;
            }
            
            res.render('pages/login', {
                page: 'login',
                session: req.session,
                head: {
                    title: 'Touhou Network Authentication'
                }
            });
        });

        app.get('/logout', function(req, res) {
            req.session.isConnected = false;
            req.session.user = null;
            req.session.save();
            res.redirect('/login');
        });

        app.use('/webgallery', express.static(path.join(this.path, 'webgallery')));
        app.use(favicon(path.join(this.path, 'favicon.ico')));
    }
    
    listen(){
        server.listen(this.config.SERVER.port, () => {
            console.log('listening on *:' + this.config.SERVER.port);
        });
    }
};