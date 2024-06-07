module.exports = {
    redis: {
        cache: {
            host: 'data.1zw2it.clustercfg.usw1.cache.amazonaws.com',
            port: 6379,
            options: {},
            cluster: true,
        },
        thirdPartyMsgQueue: {
            host: 'msg.1zw2it.clustercfg.usw1.cache.amazonaws.com',
            port: 6379,
            options: {},
            cluster: true,
        },
    },
    mongodb: {
        iotgo: {
            uri: 'mongodb://masterdb.coolkit.run:27017,slavedb.coolkit.run:27017/iotgo',
            options: {
                user: 'ckApiProject2',
                pass: '$3Z&1~jjJvcv-$DQP%kFs5y0',
                dbName: 'iotgo',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'replrs',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 2,
            },
        },
        otaDB: {
            // 走iotgo做权限认证
            uri: 'mongodb://masterdb.coolkit.run:27017,slavedb.coolkit.run:27017/iotgo',
            options: {
                user: 'ckApiProject2',
                pass: '$3Z&1~jjJvcv-$DQP%kFs5y0',
                dbName: 'otaDB',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'replrs',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 1,
            },
        },
    },
};