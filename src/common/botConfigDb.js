const adb = require('../lib/nedb')()

async function addBotConfig(info) {
  try {
    let doc = await adb.insert(info)
    return doc
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getBotConfig() {
  try {
    let search = await adb.find({})
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}
module.exports = {
  addBotConfig,
  getBotConfig,
}
