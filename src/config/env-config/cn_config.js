module.exports = {
    redis: {
        cache: {
            host: 'data.q6jj0t.clustercfg.cnn1.cache.amazonaws.com.cn',
            port: 6379,
            options: {},
            cluster: true,
        },
        thirdPartyMsgQueue: {
            host: 'msg.q6jj0t.clustercfg.cnn1.cache.amazonaws.com.cn',
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
                pass: 'Q>RB)yt#cyuv,cNDVBWPGvPU',
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
                pass: 'Q>RB)yt#cyuv,cNDVBWPGvPU',
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