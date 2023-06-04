const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    age: Number,
    current_balance: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', schema);

module.exports = User;