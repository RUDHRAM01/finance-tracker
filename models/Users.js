const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    phone1: Number,
    phone2: Number,
    address: String,
    total_deposits: {
        type: Number,
        default: 0
    },
    total_withdrawals: {
        type: Number,
        default: 0
    },
    current_balance: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', schema);

module.exports = User;