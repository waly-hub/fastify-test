const config = require('../config');
const { headersKey } = require('../utils/constant');
//保存已经校验过允许跨域的地址（options请求）
const allowOptionsCROSSet = new Set();

//按appid保存已经校验过允许跨域的地址
const allowCROSMap = new Map();

function checkCROS(req, resp) {
    if (!req || !resp || !req.headers) {
        return;
    }
    const origin = req.headers.origin;
    if (!origin) {
        //header中没有源域名的头，不做跨域设置
        return;
    }

    if (req.httpMethod === 'OPTIONS') {
        checkOptionsCROS(req, resp, origin);
    } else {
        checkNormalCROS(req, resp, origin);
    }
}

function checkOptionsCROS(req, resp, origin) {
    //查找缓存
    if (allowOptionsCROSSet.has(origin)) {
        return setCROS(req, resp, origin);
    }

    //由于options请求是浏览器发出的，不会带上用户自定义的headers，所以无法依据appid来判断是否要设置跨域头
    //所以将所有appid配置的域名遍历，只要有匹配的就行
    for (const appid in config.appidCROSOrigin) {
        const crosOrigin = config.appidCROSOrigin[appid];
        if (crosOrigin === '*' || (crosOrigin instanceof RegExp && crosOrigin.test(origin))) {
            //通配所有域名，或者正则表达式跟源域名匹配，就缓存允许的源域名，并设置跨域头
            allowOptionsCROSSet.add(origin);
            return setCROS(req, resp, origin);
        }
    }

    //特定path下允许跨域的源域名
    const crosOrigin = config.pathOptionCROSOrigin[req.path];
    if (crosOrigin === '*' || (crosOrigin instanceof RegExp && crosOrigin.test(origin))) {
        //通配所有域名，或者正则表达式跟源域名匹配，就设置跨域头
        return setCROS(req, resp, origin);
    }
}

function checkNormalCROS(req, resp, origin) {
    //如果响应上下文中有允许跨域的设置，就设置跨域头
    // const ctxCros = responseCtx.cros;
    // if (ctxCros === '*' || (ctxCros instanceof RegExp && ctxCros.test(origin))) {
    //     return setCROS(req, resp, origin);
    // }

    //依据appid来判断是否要设置跨域头
    const appid = req.headers[headersKey.appid];
    if (!req.headers[headersKey.appid]) {
        //header中没有appid，不做跨域设置
        return;
    }

    //查找缓存
    let allowOriginSet = allowCROSMap.get(appid);
    if (!allowOriginSet) {
        allowOriginSet = new Set();
        allowCROSMap.set(appid, allowOriginSet);
    }
    if (allowOriginSet.has(origin)) {
        //找到缓存的成功结果，直接返回
        return setCROS(req, resp, origin);
    }

    //查找appid对应的跨域域名配置
    const crosOrigin = config.appidCROSOrigin[appid];
    if (!crosOrigin) {
        //没有找到配置，不做跨域设置
        return;
    }

    if (crosOrigin === '*' || (crosOrigin instanceof RegExp && crosOrigin.test(origin))) {
        //通配所有域名，或者正则表达式跟源域名匹配，就缓存允许的源域名，并设置跨域头
        allowOriginSet.add(origin);
        return setCROS(req, resp, origin);
    }
}

function setCROS(req, resp, allowOrigin) {
    if (!resp.headers) {
        resp.headers = {};
    }
    resp.headers['Access-Control-Allow-Origin'] = allowOrigin;
    resp.headers['Access-Control-Allow-Credentials'] = 'true';
    if (req.httpMethod === 'OPTIONS') {
        resp.headers['Access-Control-Allow-Methods'] = 'POST,GET,PUT,DELETE,OPTIONS';
        resp.headers['Access-Control-Allow-Headers'] = req.headers['access-control-request-headers'] ?? '*';
    }
}

module.exports = {
    checkCROS,
};
