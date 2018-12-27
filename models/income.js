const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    exDividendDate: Date,	
    earningsDate: Date,
    incomeType: String,
    value: Number,
    companyId: String
});

module.exports = mongoose.model('Income', incomeSchema);