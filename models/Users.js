const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    phone1: Number,
    phone2: Number,
    address: String,
    current_balance: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', schema);

module.exports = User;