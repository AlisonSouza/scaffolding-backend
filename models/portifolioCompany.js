const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portifolioCompanySchema = new Schema({
    portifolioId: String,
    companyId: String
});

module.exports = mongoose.model('PortifolioCompany', portifolioCompanySchema);