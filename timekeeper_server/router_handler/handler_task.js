
// 导入配置文件
const config = require('../config')
const tools  =require('../utils/Tools')
const {insertTask} = require("../mapper/taskMapper");
const {isEmpty} = require("../utils/Tools");
const url = require("url");
const querystring = require("querystring");
const intervalControl = require("../utils/schedule");
const http = require("http");
const https = require('https')
const shortid = require("shortid");
const {dingTalkNotify} = require("../task/httpTask");
const {taskCheckAndSet} = require("../task/task");

// 创建任务的处理函数
exports.createTask = (req, res) => {
    const task = req.body
    task.timeZone = req.auth.timeZone
    task.taskId = shortid.generate() + Math.random().toString(26).slice(12)
    insertTask(task)
    const tasks = task.taskType.replace('，', ',').replace(' ', '').split(',')
    taskCheckAndSet(tasks, task)
    res.success()
}

// 查询所有任务的处理函数
exports.listTask = (req, res) => {
    const query = url.parse(req.url, true).query;
    const val = querystring.unescape(query.val);
    log.error(intervalControl.listSchedule())
    res.success(intervalControl.listSchedule())
}
