/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/16 14:00
 * @File timekeeper_server/task.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const {checkScheduleTask} = require("./scheduleTask")
const {selectActiveTask} = require("../mapper/taskMapper");
const taskCheckAndSet = (tasks, task) => {
    if (tasks[0].trim() === 'cron') {
        checkScheduleTask(tasks, task)
    }
}

module.exports = {
    taskCheckAndSet
}
