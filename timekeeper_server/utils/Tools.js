const joi = require("joi")
exports.getClientIp=(req)=> {
    let ipAddress
    let forwardedIpsStr = req.headers['X-Forwarded-For']//判断是否有反向代理头信息
    if (forwardedIpsStr) {//如果有，则将头信息中第一个地址拿出，该地址就是真实的客户端IP；
        let forwardedIps = forwardedIpsStr.split(',')
        ipAddress = forwardedIps[0]
    }
    if (!ipAddress) {//如果没有直接获取IP；
        ipAddress = req.connection.remoteAddress
    }
    return ipAddress
}

exports.isJsonString = (str) => {
    // 判断是否是json字符串
    try {
        if (typeof JSON.parse(str) == "object") {
            // 解析后是object说明未解析前是字符串，需要解析
            return true;
        }
    } catch (e) {
    }
    return false;
}

exports.isEmpty = (val) => {
    return val === undefined || val === '' || val === null || val === [] || val === {} || val === 'undefined' || val === 'null'
}
