const rp = require('request-promise')
/**
 * post请求
 * @param url 请求地址
 * @param data 参数
 * @constructor
 */
// @ts-ignore
async function Post(url, data) {
    try {
        var options = {
            method: 'POST',
            uri: url,
            body: data,
            json: true // Automatically stringifies the body to JSON
        };
        let res = await rp(options);
        return res;
    } catch (e) {
        console.log("post请求请求失败:", e);
        return;
    }
}

/**
 * get请求
 * @param url
 * @returns {Promise<void>}
 * @constructor
 */
async function Get(url) {
    try {
        var options = {
            uri: url,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        let res = await rp(options);
        return res;
    } catch (e) {
        console.log("post请求请求失败:", e);
        return;
    }
}

module.exports = {
    Get,
    Post,
}
