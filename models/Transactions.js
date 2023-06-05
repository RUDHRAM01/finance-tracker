const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    transactions: Array
});

const Transaction = mongoose.model('Transaction', schema);

module.exports = Transaction;