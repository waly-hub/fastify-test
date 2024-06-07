module.exports = {
    redis: {
        cache: {
            host: 'data.wcaxhg.clustercfg.apse1.cache.amazonaws.com',
            port: 6379,
            options: {},
            cluster: true,
        },
        thirdPartyMsgQueue: {
            host: 'sqs.wcaxhg.clustercfg.apse1.cache.amazonaws.com',
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
                pass: 'w;w!*P_hc;a=V42_4al!_nR7',
                dbName: 'iotgo',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'as-db',
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
                pass: 'w;w!*P_hc;a=V42_4al!_nR7',
                dbName: 'otaDB',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'as-db',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 1,
            },
        },
    },
};