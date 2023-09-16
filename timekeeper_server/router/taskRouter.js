const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const taskHandler = require('../router_handler/handler_task')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_task_schema, reg_task_create_schema} = require('../schema/taskSchema')

router.post('/create', expressJoi(reg_task_create_schema), taskHandler.createTask)
router.get('/list', taskHandler.listTask)
// 将路由对象共享出去
module.exports = router
