const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const saltRounds = 10;


router.post('/register', async (req, res) => {
    const { username, password, email, firstName, lastName, age } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        password: hash,
        email,
        firstName,
        lastName,
        age
    });
    await user.save();
    res.redirect('/login');
});


router.post('/login', async (req, res) => {
    const { userEmail, password } = req.body;
    if (!userEmail || !password) {
        res.redirect('/login');
    } else {
        User.findOne({ userEmail }, async (err, user) => {
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        });
    }
});    



module.exports = router;


