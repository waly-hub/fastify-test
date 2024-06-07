const mongoose = require('mongoose');

class MongoClient {
    constructor({ uri, options, schemas }) {
        this.schemas = schemas;
        this.uri = uri;
        this.options = options || {};
        this.models = {};
        this.connection = mongoose.createConnection();
        setupEvent(this.connection);
    }

    async connect() {
        try {
            console.log(`开始连接mongodb ${this.uri}`);
            await new Promise((resolve, reject) => {
                this.connection.once('connected', resolve);
                this.connection.openUri(this.uri, this.options).catch(reject);
            });

            console.log('mongodb连接成功');
            return {};
        } catch (err) {
            console.error('mongodb连接失败', err);
            return { error: err };
        }
    }

    getCollection(collectionName) {
        if (this.schemas[collectionName]) {
            if (this.models[collectionName]) {
                return this.models[collectionName];
            }
            let model = this.connection.model(this.schemas[collectionName].name, this.schemas[collectionName].schema);
            this.models[collectionName] = model;
            return model;
        }
        console.error('not found the collection %s in schemas', collectionName);
        return null;
    }
}

function setupEvent(connection) {
    connection.on('connecting', () => {
        console.log('mongoose event connecting');
    });

    connection.on('connected', () => {
        console.log('mongoose event connected');
    });

    connection.on('disconnecting', () => {
        console.log('mongoose event disconnecting');
    });

    connection.on('disconnected', () => {
        console.log('mongoose event disconnected');
    });

    connection.on('close', () => {
        console.log('mongoose event close');
    });

    connection.on('reconnected', () => {
        console.log('mongoose event reconnected');
    });

    connection.on('error', (err) => {
        console.log('mongoose event error', err);
    });

    connection.on('fullsetup', () => {
        console.log('mongoose event fullsetup');
    });
}

module.exports = MongoClient;
