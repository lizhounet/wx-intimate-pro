const { loadBotConfigAll, startTask } = require('../service/intimateService');

async function onLogin(user) {
    try {
        console.log(`${user} login`)
        //加载配置
        await loadBotConfigAll()
        //启动定时任务
        await startTask(this)
    } catch (e) {
        console.log('监听登录失败', e)
    }
}

module.exports = onLogin