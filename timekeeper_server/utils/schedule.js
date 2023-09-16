/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/15 22:33
 * @File timekeeper_server/schedule.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const schedule = require('node-schedule');
const {updateTaskState} = require("../mapper/taskMapper");

// 生成新的定时任务
let interval = async (options, fun) => {
    return new Promise((resolve) => {
        schedule.scheduleJob(options.taskId, parseTime(options), async () => {
            await fun()
            if (!options.taskOptions.isCircle) {
                stopSchedule(options)
            }
        });
    })
}

// 删除定时任务
let stopSchedule = async (options) => {

    // 查看所有的定时任务
    // for (let i in schedule.scheduledJobs) {
    //     console.error("任务删除前：" + i);
    // }
    // 终止之前的定时任务
    console.log('终止的任务', `${options.taskId}, ${options.taskName}`)
    if (schedule.scheduledJobs[`${options.taskId}`]) {
        schedule.scheduledJobs[`${options.taskId}`].cancel();
        sqliteDB.runSql(updateTaskState(0, options.taskId)).then(res => {
            log.warn('关闭任务 ' + options.taskName)
        })
    }

    // 查看剩下的定时任务
    // for (let i in schedule.scheduledJobs) {
    //     console.error("任务删除后：" + i);
    // }
    // time.cancel()

    // console.log('删除成功')
}


const listSchedule = async () => {
    const res = []
    for (let i in schedule.scheduledJobs) {
        res.push(i)
    }
    return res
}

// 时间选择
let GetDateStr = (maintain_time, AddDayCount) => {
    let dd = new Date(`${maintain_time}`);
    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    const y = dd.getFullYear();
    let m = dd.getMonth() + 1
    const d = dd.getDate()
    const h = dd.getHours()
    const min = dd.getMinutes()
    return {
        year: y,
        month: m,
        day: d,
        hour: h,
        min: min,
    }
}

const parseTime = (options) => {
    // if (options.isCircle) {
    //
    // }
    // else {
    //     const date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second)
    //     return new Intl.DateTimeFormat('en-US', {timeZone: options.timeZone}).format(date)
    // }

    let rule = new schedule.RecurrenceRule();
    rule.tz = options.timeZone;
    const taskOption = options.taskOptions.cron
    if (!isEmpty(taskOption.second)) {
        rule.second = taskOption.second;
    }
    if (!isEmpty(taskOption.minute)) {
        rule.minute = taskOption.minute;
    }
    if (!isEmpty(taskOption.hour)) {
        rule.hour = taskOption.hour;
    }
    if (!isEmpty(taskOption.day)) {
        rule.date = taskOption.day;
    }
    if (!isEmpty(taskOption.month)) {
        rule.month = taskOption.month;
    }
    if (!isEmpty(taskOption.year)) {
        rule.year = taskOption.year;
    }
    if (!isEmpty(taskOption.dayOfWeek)) {
        rule.dayOfWeek = taskOption.dayOfWeek
    }
    return rule
}

const isEmpty = (val) => {
    if (val === undefined) {
        return true
    }

    if (val === null) {
        return true
    }

    if (val === '') {
        return true
    }

    if (val === []) {
        return true
    }

    if (val === {}) {
        return true
    }

    if (val === 'undefined') {
        return true
    }

    if (val === 'null') {
        return true
    }
    return false
}

const intervalControl = {
    startSchedule: interval,
    listSchedule: listSchedule,
    stopSchedule: stopSchedule
}

module.exports = intervalControl
