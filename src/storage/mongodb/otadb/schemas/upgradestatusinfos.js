/**
 * Dependencies
 */
//var mongoose = require('/opt/node_modules/mongoose');
const mongoose = require('mongoose');
/**
 * Private variables and functions
 */
const Schema = mongoose.Schema;


const schema = new Schema({
    apikey: { type: String, required: true, index: true },
    deviceid: { type: String, required: true, index: { unique: true }, match: /^[0-9a-f]{10}$/ },
    currentVer: { type: String, required: true, index: true },
    targetVer: { type: String, required: true, index: true },
    codeArr: { type: Array },
    msg: { type: String, index: true },
});


module.exports = {
    name: 'upgradestatusinfos',
    schema: schema,
};