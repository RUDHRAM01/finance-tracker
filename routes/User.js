const express = require("express")
const userRoute = express();
const bodyParser = require('body-parser');
const userController = require('../controller/User');

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: false }));


userRoute.set('view engine', 'ejs');
userRoute.set('views', './views');

userRoute.get("/dashboard/profile",userController.securePathLayer, userController.GetUserProfile);

userRoute.post("/dashboard/profile", userController.UpdateProfile);

userRoute.get("/login", userController.middleWare, function (req, res) {
    res.render("Login");
});

userRoute.post("/login", userController.LoginUser);

userRoute.get("/register", userController.middleWare, function (req, res) {
    res.render("Register");
});

userRoute.post("/register", userController.RegisterUser);

userRoute.get("/dashboard", userController.securePathLayer, userController.GetDashboard);

userRoute.post('/transaction', userController.securePathLayer, userController.DoTransaction);

userRoute.post('/deleteTransaction', userController.securePathLayer, userController.DeleteTransaction);

userRoute.post('/updateTransaction', userController.securePathLayer, userController.UpdateTransaction);

userRoute.get("/logout", userController.LogoutUser);

userRoute.get("/", function (req, res) {
    if (req.session.user) {
        res.redirect("/dashboard");
    }
    else {
        res.render("Login");
    }
});

userRoute.get('/verify', userController.verifyMail)

userRoute.get('/*', (req, res) => {
    res.render('Error404');
})



module.exports = userRoute;