const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const https = require('https');
const cookieParser = require('cookie-parser');
const app = express();
const fs = require('fs');
const userR = require('./routers/user.r');

require("dotenv").config();
const port = process.env.PORT_AUTH;

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

require('./routers/passport.r')(app);

app.get('/', (req, res, next) => {
    var chk = false;
    if (req.isAuthenticated()) chk = true;
    res.render('home', { check: false, chk: chk, title: "Home" });
});

app.use('/user', userR);

// Error middleware
app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});

var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  };

https.createServer(options, app)
    .listen(port, () => { console.log(`Listening on port ${port}`) });