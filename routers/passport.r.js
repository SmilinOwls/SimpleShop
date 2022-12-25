const bycrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userC = require('../controllers/user.c');

module.exports = app => {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null,user.Username);
    });

    passport.deserializeUser(async(un, done) =>{
        try{
            const user = await userC.byName(un);
            done(null,user);
        } catch(err){
            done(err,null);
        }
    });

    passport.use(new localStrategy({
        usernameField: 'Username',
        passwordField: 'Password'
    }, async(username, pw, done) => {
        try {  
            const user = await userC.byName(username);
            if(!user[0]) return done(null, false);
            console.log(user[0]);
            const len = user[0].Address.length;
            const cmp = await bycrypt.compare(pw, user[0].Password + user[0].Token.substr(len - 10));
            if(!cmp) return done(null, false);
            return done(null,user[0]);
        } catch (error) {
            return done(error);
        }
    }));
    
}