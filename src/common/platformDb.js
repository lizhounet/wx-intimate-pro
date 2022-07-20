const platformDb = require('../lib/nedb')()

async function addPlatformDbConfig(info) {
  try {
    let doc = await platformDb.insert(info)
    return doc
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getPlatformDbConfig() {
  try {
    let search = await platformDb.find({})
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}
module.exports = {
  addPlatformDbConfig,
  getPlatformDbConfig,
}
