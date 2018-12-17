const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    price: String,
    purchaseDate: Date,
    quantity: Number
});

module.exports = mongoose.model('Purchase', purchaseSchema);