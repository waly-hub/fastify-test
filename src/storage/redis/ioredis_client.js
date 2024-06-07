const ioredis = require('ioredis');

//每次redis重连等待增加的间隔时间，毫秒
const RECONNECT_INTERVAL = 100;
//redis重连等待的最大时间，毫秒
const MAX_RECONNECT_INTERVAL = 5000;
//每个redis请求失败的重试次数
const MAX_REQUEST_RETRY = 1;

class IORedisClient {
    constructor({ port = 6379, url, isCluster, alias }) {
        this.port = port;
        this.url = url;
        this.client = null;
        this.isCluster = isCluster;
        this.alias = alias;
        this.ready = false;
    }

    //连接redis
    async connect() {
        if (!this.isCluster) {
            console.log(`开始连接${this.alias} redis ${this.url} 单机模式`);
            try {
                this.client = new ioredis();
                console.log(`${this.alias} redis 连接成功`);
                return {};
            } catch (error) {
                console.error(`${this.alias} redis 连接失败`, error);
                this.client.disconnect();
                return { error };
            }
        }

        //集群模式
        //允许url填写多个地址，以分行间隔，比如 '192,168.1.10,192.168.1.11'
        //但必须使用同一个端口
        const nodeUrls = this.url.split(',');
        console.log('nodeUrls', nodeUrls);
        const nodes = [];
        for (const url of nodeUrls) {
            if (url) {
                nodes.push({ host: url.trim(), port: this.port });
            }
        }
        this.client = new ioredis.Cluster(nodes, {
            clusterRetryStrategy: clusterRetryStrategy.bind(this),
            enableReadyCheck: true,
            lazyConnect: true,
            redisOptions: {
                maxRetriesPerRequest: MAX_REQUEST_RETRY,
                retryStrategy: retryStrategy.bind(this),
                reconnectOnError: reconnectOnError.bind(this),
            },
        });
        setupClusterEvent(this.client, this.alias);

        try {
            console.log(`开始连接${this.alias} redis ${this.url}`);
            await new Promise((resolve, reject) => {
                this.client.once('ready', resolve);
                this.client.connect().catch(reject);
            });
            this.ready = true;
            console.log(`${this.alias} redis 连接成功`);
            return {};
        } catch (err) {
            console.error(`${this.alias} redis 连接失败`, err);
            this.client.disconnect();
            return { error: err };
        }
    }

    //发送redis指令
    async command(command, ...args) {
        if (!this.client) {
            throw ('redis client is not ready to command');
        }
        return await this.client[command.toLowerCase()](args);
    }
}

//设置redis客户端的事件响应方法
function setupRedisEvent(redisClient, alias) {
    redisClient.on('connect', () => {
        console.info(`${alias} redis client connect`);
    });

    redisClient.on('ready', () => {
        console.info(`${alias} redis client ready`);
    });

    redisClient.on('error', (err) => {
        console.info(`${alias} redis client error`, err);
        console.info(`${JSON.stringify(err)}`);
        process.exit(-1);
    });

    redisClient.on('close', () => {
        console.info(`${alias} redis client close`);
    });

    redisClient.on('reconnecting', (times) => {
        console.info(`${alias} redis client reconnecting`, times);
    });

    redisClient.on('end', () => {
        console.info(`${alias} redis client end`);
    });
}

//设置redis集群客户端的事件响应方法
function setupClusterEvent(clusterClient, alias) {
    clusterClient.on('connect', () => {
        console.info(`${alias} redis cluster client connect`);
    });

    clusterClient.on('ready', () => {
        console.info(`${alias} redis cluster client ready`);
    });

    clusterClient.on('error', (err) => {
        console.info(`${alias} redis cluster client error`, err);
    });

    clusterClient.on('close', () => {
        console.info(`${alias} redis cluster client close`);
    });

    clusterClient.on('reconnecting', () => {
        console.info(`${alias} redis cluster client reconnecting`);
    });

    clusterClient.on('end', () => {
        console.info(`${alias} redis cluster client end`);
    });

    clusterClient.on('+node', (node) => {
        console.info(`${alias} redis cluster + ${node.options.host}`);
        setupRedisEvent(node, alias);
    });

    clusterClient.on('-node', (node) => {
        console.info(`${alias} redis cluster - ${node.options.host}`);
    });

    clusterClient.on('node error', (err, key) => {
        console.info(`${alias} redis cluster node error`, err, key);
    });
}

//断开连接后的重连策略方法
function retryStrategy(times) {
    if (!this.ready) {
        //如果客户端一开始就没有连接上，则不要重试
        return null;
    }
    console.info(`${this.alias} redis节点重连 第${times}次`);
    const delay = Math.min(times * RECONNECT_INTERVAL, MAX_RECONNECT_INTERVAL);
    return delay;
}

//redis集群的节点全部失效时重连的策略方法
function clusterRetryStrategy(times) {
    if (!this.ready) {
        //如果客户端一开始就没有连接上，则不要重试
        return null;
    }
    console.info(`${this.alias} redis集群重连 第${times}次`);
    const delay = Math.min(times * RECONNECT_INTERVAL, MAX_RECONNECT_INTERVAL);
    return delay;
}

//当redis遇到某些错误时，返回1，可以强制重连redis
function reconnectOnError(err) {
    const msg = err.message;
    if (msg.indexOf('READONLY') >= 0 || msg.indexOf('CLUSTERDOWN') >= 0) {
        return 1;
    }
}

module.exports = IORedisClient;
