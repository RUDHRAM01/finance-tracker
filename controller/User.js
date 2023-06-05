const User = require('../models/Users');
const mongoose = require('mongoose');
const TransactionModel = require('../models/Transactions');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { ObjectId } = mongoose.Types;
const saltRounds = 10;

const sendVerifyMail = (email, id) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                requireTLS: true,
                user: 'financetrackermail@gmail.com',
                pass: 'kuuaatxdetwzebgh'
            }
        });
        const mailOptions = {
            from: 'financetrackermail@gmail.com',
            to: email,
            subject: 'Verify your email',
            html: `<h1>Hi user</h1><br><p>Click <a href="http://localhost:8000/verify?id=${id}">here</a> to verify your email</p>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent successfully: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }

}

const verifyMail = async (req, res) => {
    try {
        const { id } = req.query;
        const user = await User.updateOne({ _id: id }, { $set: { isVerified: true } });
        if (user) {
            res.render('EmailVerify');
        } else {
            res.render('Register', { message: 'Your email is not verified, Please try again' });
        }
    }
    catch (error) {
        console.log(error);
    }
}

const middleWare = (req, res, next) => {
    console.log(req.session.user);
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

const securePathLayer = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

async function RegisterUser(req, res) {
    const { password, email } = req.body;
    try {
        const checkAlready = await User.findOne({ email });
        if (checkAlready) {
            res.render('Register', { message: 'Email already exists, Please try to login' });
        } else {
            const hash = await bcrypt.hash(password, saltRounds);
            const user = new User({
                password: hash,
                email
            });
            const userData = await user.save();
            if (userData) {
                sendVerifyMail(req.body.email,userData._id);
                res.render('Register', { message: 'Your registration is successful, Please verify your email' });
            } else {
                res.render('Register', { message: 'Registration failed, Please try again' });
            }
        }
    } catch (error) {
        console.log(error);
    }
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
                    const isVerified = user.isVerified;
                    if (isVerified) {
                        req.session.user = user;
                        res.redirect('/dashboard');
                    } else {
                        res.render('Login', { message: 'Your email is not verified, Please try again' });
                    }
                } else {
                    res.render('Login', { message: 'Invalid credentials, Please try again' });
                }
            } else {
                res.render('Login', { message: 'Invalid credentials, Please try again' });
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

async function GetUserProfile(req, res) {
    try {
        const user = await User.findOne({ _id: req.session.user._id });
        if (user) {
            console.log(user);
            res.render('Profile', { user , name:user.name });
        }
    } catch (error) {
        console.error(error);
    }
}


async function GetDashboard(req, res) {
    try {
        const user = await User.findOne({ _id: req.session.user._id });
        const transactionData = await TransactionModel.findOne({ id: req.session.user._id });
        let transactionInfo = transactionData?.transactions;
        if (user) {
            res.render('Dashboard', { user,transactionInfo });
        }
    } catch (error) {
        console.error(error);
    }
}


async function DoTransaction(req, res) {
    const { date,description,amount,paidTo } = req.body;
    try {
        const transactionData = await TransactionModel.findOne({ id: req.session.user._id });
        if (transactionData === null) {
            const transaction = new TransactionModel({
                id: req.session.user._id,
                transactions: [{
                    id: new ObjectId(),
                    date,
                    description,
                    amount,
                    paidTo
                }]
            });
            const transactionResult = await transaction.save();
            if (transactionResult) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/dashboard');
            }
        } else {
            const transaction = await TransactionModel.updateOne({ id: req.session.user._id }, { $push: { transactions: {  id: new ObjectId(),date, description, amount, paidTo } } });
            if (transaction) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/dashboard');
            }
        }
    }catch(error) {
        console.error(error);
    }
}


async function DeleteTransaction(req, res) {
    const { id } = req.params;
    try {
        const transactionData = await TransactionModel.findOne({ id: req.session.user._id });
        if (transactionData) {
            const transaction = await TransactionModel.updateOne({ id: req.session.user._id }, { $pull: { transactions: { id: id } } });
            if (transaction) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/dashboard');
            }
        }
    }catch(error) {
        console.error(error);
    }
}


async function UpdateTransaction(req, res) {
    const { id } = req.params;
    const { date,description,amount,paidTo } = req.body;
    try {
        const transactionData = await TransactionModel.findOne({ id: req.session.user._id });
        if (transactionData) {
            const transaction = await TransactionModel.updateOne({ id: req.session.user._id }, { $set: { transactions: { id: id,date, description, amount, paidTo } } });
            if (transaction) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/dashboard');
            }
        }
    }catch(error) {
        console.error(error);
    }
}


module.exports = {
    RegisterUser,
    LoginUser,
    UpdateProfile,
    verifyMail,
    middleWare,
    securePathLayer,
    GetUserProfile,
    GetDashboard,
    DoTransaction,
    DeleteTransaction,
    UpdateTransaction
}