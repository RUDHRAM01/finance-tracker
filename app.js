const express = require("express")
const dotenv = require('dotenv');
const mongoose = require("mongoose")
const User = require("./router/User")
const session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
dotenv.config();


const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// check login
function checkLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.use("/user", User);
app.get("/", (req, res) => {
    res.render("Home");
})
app.get("/login", (req, res) => {
    res.render("Login");
})
app.get("/register", (req, res) => {
    res.render("Register");
})

app.get("/dashboard", checkLogin, (req, res) => {
    res.render("Dashboard");
})
app.get("/*", (req, res) => {
    res.render("Error404");
})
app.listen(8000, () => {
    console.log("app is running...");
    mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connection to MongoDB successful');
    }).catch((err) => {
        console.log('Connection to MongoDB failed');
    });    
})