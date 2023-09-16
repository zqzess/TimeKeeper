/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/15 19:08
 * @File timekeeper_server/taskSchema.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

const taskId = joi.string().alphanum().required()
const taskName = joi.string().alphanum().min(1).max(20).required()
const taskType = joi.string().required()
const taskOptions = joi.required()
const createUser = joi.string().alphanum().min(1).max(10).required()

exports.reg_task_schema = {
    // 表示需要对 req.body 中的数据进行验证，当然还包括有query、params等
    body: {
        'taskId': taskId,
        'taskName': taskName,
        'taskType': taskType,
        'taskOptions': taskOptions,
        'createUser': createUser
    },
}

exports.reg_task_create_schema = {
    // 表示需要对 req.body 中的数据进行验证，当然还包括有query、params等
    body: {
        'taskName': taskName,
        'taskType': taskType,
        'taskOptions': taskOptions,
        'createUser': createUser
    },
}
