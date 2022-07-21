const botConfigDb = require('../lib/nedb')()

async function addBotConfig(info) {
  try {
    await botConfigDb.remove()
    let doc = await botConfigDb.insert(info)
    return doc
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getBotConfig() {
  try {
    let search = await botConfigDb.find({})
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}
module.exports = {
  addBotConfig,
  getBotConfig,
}
