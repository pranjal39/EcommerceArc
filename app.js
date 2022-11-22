const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const Strategyf = require('passport-facebook').Strategy; 
const { Strategy } = require('passport-google-oauth20');
const nodeMailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const encodeUrl = bodyParser.urlencoded({ extended: false });
const viewPath = path.join(__dirname,"./views");
const pool = require("./database");
const port = process.env.PORT || 8080;


//HANDLER
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
 
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'SECRET'
}));

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));



//ROUTING
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/index', (req,res) => {
    res.render('index')
});

app.get('/register', (req,res) => {
    res.render('register')
});

app.get('/login', (req,res) => {
    res.render('login')
});

app.get('/cart', (req,res) => {
    res.render('cart')
});

app.get('/checkout', (req,res) => {
    res.render('checkout')
});

app.get('/contact', (req,res) => {
    res.render('contact')
});

app.get('/detail', (req,res) => {
    res.render('detail')
});

app.get('/shop', (req,res) => {
    res.render('shop')
});

app.get('/Submit-Form', (req,res) => {

})


//Facebook
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function(user,cb){
    cb(null,user);
});
passport.deserializeUser(function(obj,cb){
    cb(null,obj);
});

passport.use( new Strategyf(
    {
        clientID:'1783806928660576',
        clientSecret:'0aaf07aa549e9b9925438cd2ec5d95de',
        callbackURL:'http://localhost:8080/fb/auth',
        profileFields: ['id', 'displayName']
    },
    function(accessToken, refreshToken, profile, done){
        console.log(accessToken,refreshToken,profile); 
        
        // if user exists by id
        // else save user 
        const user = {};
        done(null,user);
    }
));

app.use('/login/fb',passport.authenticate('facebook'));

app.use('/failed/login',(req,res,next) => {
    res.send('login failed');
});

app.use('/fb/auth', passport.authenticate('facebook',
    {failureRedirect: '/failed/login'}), function (req, res, next) {
        res.render('index2');
});

app.use('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });



//GOOGLE
passport.use(new Strategy({
        clientID: '376103008274-vv3ufsbi66fq6n446sqh051qloiri5m2.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/auth/google/callback'
},
    function(accessToken, refreshToken, profile, done){
        console.log(accessToken,refreshToken,profile);
        done(null, {})
    }
));

app.get('/auth/google', passport.authenticate('google',{scope:['profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
    (req, res, next) => {
        res.render('index2');
    })

app.get('/auth/fail', (req, res, next) => {
    res.render('user logged in failed');
});

app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});



//DATABASE
// (async () => {
//     await pool.connect();
//     const result = await pool.query(`Insert into usersdata (name, email, password) VALUES ('Technical', 'tech@gmail.com', 'A147147')`);
//     console.log(result.rows);
//     console.log(result.rowCount);
//     pool.end();
// })();

  


//SERVER
app.listen(port, () => {
    console.log('http://localhost:8080')
});

