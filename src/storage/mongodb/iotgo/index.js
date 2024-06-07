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

let iotgoDBUri = process.env.iotgoDBUri;
if (!iotgoDBUri) {
    iotgoDBUri = config.mongodb.iotgo.uri;
}

const client = new MongoClient({ uri: iotgoDBUri, options: config.mongodb.iotgo.options, schemas: schemas });
module.exports = client;
