const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_open_platform';
const schema = new Schema({
    apikey: { type: String, required: true },
    personal: {
        name: { type: String },
        email: { type: String },
        phoneNumber: { type: String },
        identifyNumber: { type: String },
        job: { type: String },
    },
    company: {
        name: { type: String },
        email: { type: String },
        phoneNumber: { type: String },
        companyName: { type: String },
        unifiedSocialCreditCode: { type: String },
        legalPersonName: { type: String },
        companyType: { type: String },
        officialWebsite: { type: String },
        companyBusinessInsights: { type: String },
        address: { type: String },
        businessLicenseKeys: [String],
        postalCode: { type: String },
        fax: { type: String },
    },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createApps: [String],
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
