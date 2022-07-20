/**
 * 延时函数
 * @param {*} ms 毫秒
 */
 async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  module.exports = {
    delay
  }