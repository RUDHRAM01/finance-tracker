const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const saltRounds = 10;


router.post('/register', async (req, res) => {
    const { password, email } = req.body;
    console.log(req.body);
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        password: hash,
        email
    });
    await user.save();
    res.redirect('/login');
});


router.post('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    const { email, password } = req.body;
    console.log(email, password)
    if (!email || !password) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findOne({ email });
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    req.session.user = user;
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            // Handle the error appropriately
            console.error(error);
            res.redirect('/login');
        }
    }
});



module.exports = router;


