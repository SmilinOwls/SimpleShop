const express = require('express');
const router = express.Router();
const userC = require('../controllers/user.c');
const bycrypt = require('bcrypt');
const jwtHelper = require("../helpers/jwt.helper");

const saltOrRounds = 10;

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET";

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
                        Password: hash,
                        FullName: req.body.FullName,
                        Token: '',
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

router.post('/signin', async (req, res, next) => {
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
    const un = req.body.Username, pw = req.body.Password;
    const expired = parseInt(req.body.expired);
    const expire = Array.from({ length: 24 }, (_, i) => i + 1);

    const user = await userC.byName(un);
    if (!user[0]) {
        return res.render('sign-in', { check: true, expire: expire, title: "Sign in" });
    }

    console.log(user[0]);
    const cmp = await bycrypt.compare(pw, user[0].Password);
    if (!cmp) {
        return res.render('sign-in', { check: true, expire: expire, title: "Sign in" });
    }

    const accessToken = await jwtHelper.generateToken(user[0], accessTokenSecret, expired);
    const refreshToken = await jwtHelper.generateToken(user[0], refreshTokenSecret, refreshTokenLife);

    user[0].Token = refreshToken;
    userC.update(user[0]).then(data => {
        if (req.body.Remember) {
            const lastUser = { Username: un, Password: pw };
            res.cookie('user', lastUser);
        }
        res.cookie('expired',expired, { maxAge: expired * 60 * 60 * 1000, httpOnly: true });
    });

    res.redirect(`http://127.0.0.1:${process.env.PORT_SHOP}/user/signin/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&expired=${expired}`);
});

router.get('/signup', (req, res, next) => {
    res.render('sign-up', { check: false, title: "Sign up" });
});

router.get('/signin', (req, res, next) => {
    const lastUser = req.cookies.user;
    res.clearCookie('user');
    const expire = Array.from({ length: 24 }, (_, i) => i + 1);
    res.render('sign-in', { check: false, expire: expire, lastUser: lastUser, title: "Sign in" });
});

router.use('/signin/callback', (req, res, next) => {
    console.log(req.query);
    res.cookie('expired',req.query.expired);
    res.redirect('/');
});

router.get('/logout', (req, res, next) => {
    res.clearCookie("expired");
    res.redirect('/');
});

module.exports = router;