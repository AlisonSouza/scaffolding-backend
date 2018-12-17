const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    receiveDate: Date,
    incomeType: String,
    value: Number,
    companyId: String
});

module.exports = mongoose.model('Income', incomeSchema);