module.exports = {
    redis: {
        cache: {
            host: 'data-cache-redis.coolkit.run',
            port: 6379,
            options: {},
            cluster: true,
        },
        thirdPartyMsgQueue: {
            host: 'rec-msg-redis.coolkit.run',
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
                pass: 'J@88mO-p%Z1oK7c0ZS^HS<m)',
                dbName: 'iotgo',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'myrepl3',
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
                pass: 'J@88mO-p%Z1oK7c0ZS^HS<m)',
                dbName: 'otaDB', // 实际连接的db是otaDB
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'myrepl3',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 1,
            },
        },
    },

    //kinesis日志
    kinesisLog: {
        enable: true,
        region: 'cn-northwest-1',
        streamName: 'kinesis-logs',
        putTimeout: 5000,
    },
};