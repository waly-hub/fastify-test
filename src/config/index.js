let env = process.env.ENV || process.env.env;
if (['local', 'test', 'cn', 'as', 'us', 'eu'].indexOf(env) === -1) {
    // eslint-disable-next-line no-console
    //console.warn('Illegal ENV environment variable,default set test');
    env = 'test';
} else {
    // eslint-disable-next-line no-console
    console.log('The ENV for apiv2-libs is %s', env);
}

const commConfig = require('./env-config/comm_config.js');

Object.assign(commConfig, require(`./env-config/${env}_config.js`));

module.exports = commConfig;
