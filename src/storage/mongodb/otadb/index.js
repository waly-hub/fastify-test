const fs = require('fs');
const path = require('path');
const config = require('../../../config');
const MongoClient = require('../mongo_client');

const schemas = {};
const schemaPath = path.join(__dirname + '/schemas');
const files = fs.readdirSync(schemaPath);
for (const fileName of files) {
    if (fileName.endsWith('.js')) {
        const name = fileName.replace('.js', '');
        const schemaInfo = require(`./schemas/${name}`);
        schemas[schemaInfo.name] = schemaInfo;
    }
}

let otaDBUri = process.env.otaDBUri;
if (!otaDBUri) {
    otaDBUri = config.mongodb.otaDB.uri;
}

const client = new MongoClient({ uri: otaDBUri, options: config.mongodb.otaDB.options, schemas: schemas });
module.exports = client;
