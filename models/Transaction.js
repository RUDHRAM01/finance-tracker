const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    Transactions: [{
        type: String,
        ref: 'Transaction'
    }]
});

const Transaction = mongoose.model('Transaction', schema);