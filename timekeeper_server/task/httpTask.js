/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/16 12:34
 * @File timekeeper_server/httpTask.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const $http = require("axios");
const {timeout} = require("../config");
const {isEmpty} = require("../utils/Tools");
exports.dingTalkNotify = (dingOption) =>{
    return new Promise(async (resolve) => {
        let url = `https://oapi.dingtalk.com/robot/send?access_token=${dingOption.token}`
        const options = {
            headers: dingOption.headers,
            timeout: timeout
        };
        const data = {
            msgtype: 'text',
            text: {
                content: ` ${dingOption.title}\n\n${dingOption.text}`,
            }
        }
        if (dingOption.token && dingOption.secret) {
            const crypto = require('crypto');
            const dateNow = Date.now();
            const hmac = crypto.createHmac('sha256', dingOption.secret);
            hmac.update(`${dateNow}\n${dingOption.secret}`);
            const result = encodeURIComponent(hmac.digest('base64'));
            url = `${url}&timestamp=${dateNow}&sign=${result}`;
            const res = await $http.post(url, data, options)
            if (res.data.errcode === 0) {
                log.info('钉钉发送通知消息成功🎉。\n')
            } else {
                log.warn(`${data.errmsg}\n`)
            }
        } else if (!isEmpty(dingOption.token)) {
            const res = await $http.post(url, data, options)
            if (res.data.errcode === 0) {
                log.info('钉钉发送通知消息成功🎉。\n')
            } else {
                log.warn(`${data.errmsg}\n`)
            }
        } else {
        }
        resolve()
    });
}

exports.barkNotify =(barkOption) => {
    return new Promise(async (resolve) => {
        if (barkOption.bark) {
            const url = `${barkOption.bark}`
            const options = {
                headers: barkOption.headers,
                timeout,
            };
            const data = {
                title: barkOption.title,
                body: barkOption.text,
                group: `${barkOption.group}`,
                icon: `${barkOption.icon}`,
                sound: `${barkOption.sound}`,
            }
            const res = await $http.post(url, data, options)
            if (res.data.code === 200) {
                log.info('Bark APP发送通知消息成功🎉\n')
            } else {
                log.warn(`${data.message}\n`)
            }
        }
        resolve()
    })
}

exports.httpGet = (option) => {
    return $http({
        url: option.url,
        headers: option.headers,
        method: "GET",
        params: option.data
    })
}

exports.httpPost = (option) => {
    return $http({
        url: option.url,
        headers: option.headers,
        method: "POST",
        data: option.data
    })
}
