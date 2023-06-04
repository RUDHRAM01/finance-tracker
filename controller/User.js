const User = require('../models/Users');
const bcrypt = require('bcrypt');
const saltRounds = 10;


async function RegisterUser(req, res) {
    const { password, email } = req.body;
    console.log(req.body);
    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        password: hash,
        email
    });
    await user.save();
    res.redirect('/login');
}

async function LoginUser(req, res) {
    const { email, password } = req.body;

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
        }catch(error) {
            // Handle the error appropriately
            console.error(error);
            res.redirect('/login');
        }
    }
}

async function UpdateProfile(req, res) {
    const { name, email, phone1, phone2, address } = req.body;
    try {
        const user = await User.updateOne({ email: email }, { $set: { name: name, phone1: phone1, phone2: phone2, address: address } });

        if (user) {
            res.redirect('/dashboard/profile');
        }
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    RegisterUser,
    LoginUser,
    UpdateProfile
}



