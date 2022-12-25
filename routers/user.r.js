const express = require('express');
const router = express.Router();
const userC = require('../controllers/user.c');
const bycrypt = require('bcrypt');
const passport = require('passport');

const saltOrRounds = 10;

router.post('/checkUsername', async (req, res, next) => {
    const un = req.body.Username;
    const exist = await userC.byName(un);

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var response = {
        status: 200,
        success: ''
    }

    if (exist.length > 0) {
        response.success = 'available';
    } else {
        response.success = 'none';
    }

    res.send(JSON.stringify(response));
});

router.post('/signup', async (req, res, next) => {

    const un = req.body.Username, pw = req.body.Password;
    if ((pw != req.body.Repassword)) {
        res.render('sign-up', { check: true, title: "Sign up" });
    } else {
        bycrypt.hash(pw, 10, (err, hash) => {
            if (err) throw err;
            else {
                userC.getMaxId().then(id => {
                    id = parseInt(id) || 0;
                    const user = {
                        UserID: id + 1,
                        Username: un,
                        Password: hash.slice(0, 50),
                        FullName: req.body.FullName,
                        Token: hash.substring(50),
                        Address: req.body.Address
                    }

                    console.log(user);

                    userC.add(user)
                        .then(result => console.log(result))
                        .catch(error => console.log(error));
                }).catch(error => { throw error });
                res.redirect('/user/signin');
            }
        });
    }
});

router.post('/signin', passport.authenticate('local'), async (req, res, next) => {
    // const un = req.body.Username, pw = req.body.Password;
    // const uDb = await userC.byName(un);
    // if(uDb.length == 0){
    //     res.render('sign-in',{check: true});
    // } else{

    //     if(pwDb == (pwHashed + salt)){
    //         // if(req.body.Remember) res.cookie('user',uDb[0]);
    //         // req.session.user = uDb[0];
    //         res.redirect('/category');
    //     } else{
    //         res.render('sign-in',{check: true,title: "Sign in"});
    //     }
    // }


    if (req.isAuthenticated()) {
        if (req.body.Remember) {
            const un = req.body.Username, pw = req.body.Password;
            const lastUser = { f_Username: un, f_Password: pw };
            res.cookie('user', lastUser);
        }
        res.redirect('/category');
    } else {
        res.render('sign-in', { check: true, title: "Sign in" });
    }
});

router.get('/signup', (req, res, next) => {
    res.render('sign-up', { check: false, title: "Sign up" });
});

router.get('/signin', (req, res, next) => {
    const lastUser = req.cookies.user;
    res.clearCookie('user');
    res.render('sign-in', { check: false, lastUser: lastUser, title: "Sign in" });
});

router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout(err => {
            console.log('userC-logout: ', err);
            if (err) return next(err);
        });
    }

    res.redirect('signin');
});

router.get('/profile', (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('signin');
    } else {
        res.redirect('/', { chk: true });
    }
});

module.exports = router;