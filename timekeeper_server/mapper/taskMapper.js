/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/15 19:19
 * @File timekeeper_server/taskMapper.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const shortid = require('shortid')
exports.selectTaskByUser = (name) => {
    return `select * from task where createUser ='` + name + `'`
}

exports.insertTask = (task) => {
    // const id = shortid.generate() + Math.random().toString(26).slice(12)
    return sqliteDB.getSequelizeData().Task.create({taskId:  task.taskId, taskName: task.taskName, taskType: task.taskType, taskOptions: JSON.stringify(task.taskOptions), taskState: 1, createUser: task.createUser})
}

exports.updateTaskState = (state, taskId) => {
    return `update task set taskState = ` + state + ` where taskId = '` + taskId + `'`
}

exports.selectActiveTask = () => {
    return `select * from task where ` + `taskState = 1`
}
