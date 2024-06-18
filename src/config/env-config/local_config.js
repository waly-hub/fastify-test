module.exports = {
    mongodb: {
        iotgo: {
            uri: 'mongodb://localhost:27018/iotgo',
            options: {
                useNewUrlParser: true,
                bufferCommands: false,
                // replicaSet: "myrepl3",
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 2,
                user: 'ckApiProject2',
                pass: 'J@88mO-p%Z1oK7c0ZS^HS<m)',
                dbName: 'iotgo',
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
    redis: {
        cache: {
            host: 'localhost',
            port: 6379,
            options: {},
            cluster: false,
        },
        thirdPartyMsgQueue: {
            host: 'rec-msg-redis.coolkit.run',
            port: 6379,
            options: {},
            cluster: true,
        },
    },
    redisCache: {
        PrefixKey: {
            devices: 'iotgo.devices_',
            factorydevices: 'iotgo.fd_',
            users: 'iotgo.users_',
        },
        defaultTimeout: 120,
    },
    //kinesis日志
    kinesisLog: {
        enable: true,
        region: 'cn-northwest-1',
        streamName: 'kinesis-logs',
        putTimeout: 5000,
    },
};