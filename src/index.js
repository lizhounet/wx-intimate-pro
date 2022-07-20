
const Wechaty = require('wechaty');
const onMessage = require('./handers/on-message')
const onLogin = require('./handers/on-login')
const onScan = require('./handers/on-scan')
const onReady = require('./handers/on-ready')
const { addPlatformDbConfig } = require('./common/platformDb')

const { WechatyBuilder, log } = Wechaty;

// 服务器host 默认
let platformHostUrl = 'http://47.102.105.169:9901/api/public/wx-client';
let applictionToken = '08da623d-1b3d-4768-82ac-c37fa4e7e3d1';
const initConfig = {
    PLATFORM_HOST_URL: process.env['PLATFORM_HOST_URL'] || platformHostUrl,
    APPLICTION_TOKEN: process.env['APPLICTION_TOKEN']||applictionToken,
}
//初始化平台配置
addPlatformDbConfig(initConfig)
// get a Wechaty instance
const bot = WechatyBuilder.build({
    name: 'wechat-bot',
    puppetOptions: {
        uos: true
    },
    puppet: 'wechaty-puppet-wechat',
})

// emit when the bot needs to show you a QR Code for scanning
bot.on('scan', onScan)
    .on('login', onLogin)
    .on('message', onMessage)
    .on('ready', onReady)
// start the bot
bot.start()
    .then(() => log.info('启动贴心小助手成功', 'Starter Bot Started.'))
    .catch(e => log.error('启动贴心小助手报错', e))