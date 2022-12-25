const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const reload = require('reload');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const server = require('http').createServer(app);
var io = require('socket.io')(server, { cors: { origin: '*', allowCredentials: true } });
const userR = require('./routers/user.r');
const categoryR = require('./routers/category.r');

require("dotenv").config();
const port = process.env.PORT_SHOP;


// Static public files
app.use(express.static(path.join(__dirname, '/public')));

// POST method handle
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template engine config
app.engine('hbs', handlebars.engine({
    extname: '.hbs', defaultLayout: 'main', helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

// Cookies
app.use(cookieParser());

// Session
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport
require('./routers/passport.r')(app);

app.get('/', (req, res, next) => {
    var chk = false;
    if (req.isAuthenticated()) chk = true;
    res.render('home', { check: false, chk: chk, title: "Home" });
});

app.use('/user', userR);

app.use('/category', categoryR);

// Error middleware
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});

server
    .listen(port, () => {
        io.on('connection', function (socket) {
            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });
            socket.on('image', function(msg){
                socket.emit('image', msg);
              });
        });
        console.log(`Listening on port ${port}`)
    });
reload(app);