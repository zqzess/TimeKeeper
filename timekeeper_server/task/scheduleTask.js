/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/16 14:01
 * @File timekeeper_server/scheduleTask.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/

const intervalControl = require("../utils/schedule");
const {dingTalkNotify, barkNotify} = require("./httpTask");
exports.checkScheduleTask = (tasks, task) => {
    log.warn(task.taskName + ' enable')
    intervalControl.startSchedule(task, async function (){
        log.warn(task.taskName + ' start')
        if (tasks[1].trim() === 'dingTalk') {
            await dingTalkNotify(task.taskOptions.dingTalk)
        }
        else if (tasks[1].trim() === 'bark') {
            await barkNotify(task.taskOptions.bark)
        }
        else {
            log.error("其他类型的任务")
        }
    })
}
