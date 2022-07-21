const { Get, Post } = require('../common/request');
const { getContacts, getcurrentUser } = require('../common/bot')
const { setLocalSchedule, cancelAllSchedule } = require('../common/scheduleUtils')
const { addBotConfig, getBotConfig } = require('../common/botConfigDb')
const { getPlatformDbConfig } = require('../common/platformDb')
/**
 * 获取定时任务发送内容
 * @param taskId 定时任务id
 * @returns 发送内容
 */
async function getTimeTaskSendContent(taskId) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let res = await Get(PLATFORM_HOST_URL + `/timed/send-content/${APPLICTION_TOKEN}?taskId=${taskId}`);
    return res && res.code == 1 ? res.data : null;
}

/**
 * 获取每日说任务发送内容
 * @param everyDayId 每日说id
 * @returns 每日说内容
 */
async function getSayEveryDayText(everyDayId) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let res = await Get(PLATFORM_HOST_URL + `/say-every-day/${APPLICTION_TOKEN}?everyDayId=${everyDayId}`);
    return res && res.code == 1 ? res.data : null;
}
/**
 * 获取关键字回复
 * @param keyword 关键字
 * @returns 回复内容
 */
async function getKeywordReply(keyword) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let res = await Get(PLATFORM_HOST_URL + `/keyword-reply/${APPLICTION_TOKEN}?keyword=${encodeURI(keyword)}`);
    return res && res.code == 1 ? res.data : null;
}
/**
 * 获取机器人回复
 * @param keyword 关键字
 * @param uniqueid 用户唯一身份ID，方便上下文关联
 * @returns 回复内容
 */
async function getBotReply(keyword, uniqueid) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let res = await Get(PLATFORM_HOST_URL + `/bot-reply/${APPLICTION_TOKEN}?keyword=${encodeURI(keyword)}&uniqueid=${encodeURI(uniqueid)}`);
    return res && res.code == 1 ? res.data : "你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题";
}

/**
 * 上传用户信息
 * @param {*} user 
 */
async function updateWxUserInfo(that) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let userInfo = await getcurrentUser(that);
    let user = {
        wxId: userInfo.id,
        WxCode: userInfo.id,
        WxName: userInfo.name,
        AvatarUrl: userInfo.avatarBase64,
    }
    let res = await Post(PLATFORM_HOST_URL + `/wx-user-info/${APPLICTION_TOKEN}`, user);
    if (res && res.code == 1) {
        console.log("上传用户信息成功!,响应结果:", res);
    }
    else {
        console.log("上传用户信息失败!,响应结果:", res);
    }
}
/**
 * 上传联系人
 * @param {*} that 机器人this
 */
async function updateContacts(that) {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let contacts = await getContacts(that);
    let res = await Post(PLATFORM_HOST_URL + `/contacts/${APPLICTION_TOKEN}`, contacts);
    if (res && res.code == 1) {
        console.log("上传联系人成功!,响应结果:", res);
    }
    else {
        console.log("上传联系人失败!,响应结果:", res);
    }
}

/**
 * 加载机器人所有配置信息 (定时任务，每日说)
 */
async function loadBotConfigAll() {
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = await getPlatformConfig()
    let res = await Get(PLATFORM_HOST_URL + `/wx-confg/${APPLICTION_TOKEN}`);
    if (res && res.code == 1) {
        console.log("获取机器人配置成功!,响应结果:", res);
        //写入数据库
        await addBotConfig(res.data)
    }
    else {
        console.log("获取机器人配置失败!,响应结果:", res);
    }
}
/**
 * 启动 定时任务 每日说 等
 */
async function startTask(that) {
    //先停止所有任务
    cancelAllSchedule();
    setLocalSchedule("*/30 * * * * ?", async () => {
        await updateWxUserInfo(that)
    }, '用户信息更新任务')
    //获取配置
    const botConfig = await getBotConfig()
    //启动定时任务
    await startTimedTask(that, botConfig.timedTasks);
    //启动每日说
    await startSayEveryDay(that, botConfig.sayEveryDays);
}
/**
 * 启动每日说任务
 * @param sayEveryDays 每日说任务信息
 */
async function startSayEveryDay(that, sayEveryDays) {
    if (sayEveryDays && sayEveryDays.length > 0) {
        sayEveryDays.forEach(sayEveryDay => {
            setLocalSchedule(sayEveryDay.sendTime, async () => {
                //获取定时任务发送内容
                let sendContent = await getSayEveryDayText(sayEveryDay.id);
                if (sendContent == null) {
                    console.log(`获取每日说任务(${sayEveryDay.id})发送内容为空`);
                    return;
                }
                //获取接收人
                let receivingWxNames = sayEveryDay.receivingObjectName.split(',');
                //循环发送消息
                receivingWxNames.forEach(async (wxName, index) => {
                    //查找联系人
                    let contact = await (await that.Contact.find({ alias: wxName })) || (await that.Contact.find({ name: wxName }))
                    if (contact) {
                        console.log(`每日说任务(${sayEveryDay.id})给 ${receivingWxNames[index]} 发送消息:${sendContent}`)
                        await contact.say(sendContent)
                    }
                    //查找群
                    let room = await that.Room.find({ topic: wxName })
                    if (room) {
                        console.log(`每日说任务(${sayEveryDay.id})给 ${receivingWxNames[index]} 发送消息:${sendContent}`)
                        await room.say(sendContent)
                    }
                });
            }, `每日说任务-${sayEveryDay.id}`);
            console.log(`每日说任务-${sayEveryDay.id} 设置成功`)
        })
        console.log("每日说任务设置完成");
    }
    else {
        console.log("没有配置每日说任务");
    }
}
/**
 * 启动定时任务
 * @param timedTasks 定时任务信息
 */
async function startTimedTask(that, timedTasks) {
    if (timedTasks && timedTasks.length > 0) {
        timedTasks.forEach(task => {
            setLocalSchedule(task.sendTime, async () => {
                //获取定时任务发送内容
                let sendContent = await getTimeTaskSendContent(task.id);
                if (sendContent == null) {
                    console.log(`获取定时任务(${task.id})发送内容为空`);
                    return;
                }
                //获取接收人
                let receivingWxNames = task.receivingObjectName.split(',');
                //循环发送消息
                receivingWxNames.forEach(async (wxName, index) => {
                    //查找联系人
                    let contact = await (await that.Contact.find({ alias: wxName })) || (await that.Contact.find({ name: wxName }))
                    if (contact) {
                        console.log(`定时任务(${task.id})给 ${receivingWxNames[index]} 发送消息:${sendContent}`)
                        await contact.say(sendContent)
                    }
                    //查找群
                    let room = await that.Room.find({ topic: wxName })
                    if (room) {
                        console.log(`定时任务(${task.id})给 ${receivingWxNames[index]} 发送消息:${sendContent}`)
                        await room.say(sendContent)
                    }
                });

            }, `定时任务-${task.id}`);
            console.log(`定时任务-${task.id} 设置成功`)
        })
        console.log("定时任务设置完成");
    }
    else {
        console.log("没有配置定时任务");
    }
}
/**
 * 获取平台配置
 * @returns { PLATFORM_HOST_URL, APPLICTION_TOKEN }
 */
async function getPlatformConfig() {
    const env = await getPlatformDbConfig()
    const { PLATFORM_HOST_URL, APPLICTION_TOKEN } = env
    if (!PLATFORM_HOST_URL || !APPLICTION_TOKEN) {
        console.warn('未设置PLATFORM_HOST_URL或APPLICTION_TOKEN，请设置后重试')
        return
    }
    return { PLATFORM_HOST_URL, APPLICTION_TOKEN }
}
module.exports = {
    updateWxUserInfo,
    updateContacts,
    startTask,
    loadBotConfigAll,
    getBotReply,
    getKeywordReply,

}