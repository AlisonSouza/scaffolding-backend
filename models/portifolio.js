const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portifolioSchema = new Schema({
    name: String,
    userId: String,
    companyId: String
});

module.exports = mongoose.model('Portifolio', portifolioSchema);