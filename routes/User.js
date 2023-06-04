const express = require("express")
const userRoute = express();
const bodyParser = require('body-parser');
const userController = require('../controller/User');

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: false }));


userRoute.set('view engine', 'ejs');
userRoute.set('views', './views');

userRoute.get("/dashboard/profile", function (req, res) { 
    res.render("Profile");
});

userRoute.post("/update", userController.UpdateProfile);

userRoute.get("/login", function (req, res) {
    res.render("Login");
});

userRoute.post("/login", userController.LoginUser);

userRoute.get("/register", function (req, res) {
    res.render("Register");
});

userRoute.post("/register", userController.RegisterUser);

userRoute.get("/dashboard", function (req, res) {
    res.render("Dashboard");
});

userRoute.get("/", function (req, res) {
    res.render("Home");
});

userRoute.get('/verify', userController.verifyMail)

userRoute.get('/*', (req, res) => {
    res.render('Error404');
})



module.exports = userRoute;