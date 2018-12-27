const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    price: String,
    purchaseDate: Date,
    quantity: Number,
    portifolioId: String,
    companyId: String
});

module.exports = mongoose.model('Purchase', purchaseSchema);