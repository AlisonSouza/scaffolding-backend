const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: String,
    code: String
});

module.exports = mongoose.model('Company', companySchema);