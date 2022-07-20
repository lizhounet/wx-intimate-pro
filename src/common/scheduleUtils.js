const schedule = require('node-schedule')
/**
 * 设置定时器
 * @param date 执行时间 cron
 * @param execfun 执行方法
 * @param name 任务名称
 */
function setLocalSchedule(date, execfun, name) {
    if (name) {
        schedule.cancelJob(name);//先取消该任务再重新启动
        schedule.scheduleJob(name, { rule: date, tz: 'Asia/Shanghai' }, execfun)
    }
}
/**
 * 根据任务名称取消任务
 * @param {*} name 任务名称
 */
function cancelLocalSchedule(name) {
    schedule.cancelJob(name)
}

/**
 * 取消所有任务
 */
function cancelAllSchedule() {
    for (let i in schedule.scheduledJobs) {
        cancelLocalSchedule(i)
    }
}
module.exports = {
    setLocalSchedule,
    cancelAllSchedule,
    cancelLocalSchedule,
}