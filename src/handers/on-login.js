const { updateWxUserInfo, loadBotConfigAll, startTask } = require('../service/intimateService');
const { setLocalSchedule } = require('../common/scheduleUtils')

/**
 * 上传用户信息
 */
async function uploadWxUserInfo(that) {
    setLocalSchedule("*/30 * * * * *", async () => await updateWxUserInfo(that), '用户信息更新任务')
}

async function onLogin(user) {
    try {
        console.log(`${user} login`)
        //上传用户信息
        await uploadWxUserInfo(this)
        //加载配置
        await loadBotConfigAll()
        //启动定时任务
        await startTask(this)

    } catch (e) {
        console.log('监听登录失败', e)
    }
}

module.exports = onLogin