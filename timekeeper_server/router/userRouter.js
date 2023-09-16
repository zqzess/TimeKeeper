const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/handler_user')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema, reg_regist_schema} = require('../schema/userSchema')

router.post('/regist', expressJoi(reg_regist_schema), userHandler.registUser)
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
// 将路由对象共享出去
module.exports = router
