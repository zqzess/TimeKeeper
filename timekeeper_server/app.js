// 导入 express 模块
const express = require('express')
// 导入 cors 中间件,处理跨域
const cors = require('cors')

const bodyParser = require('body-parser')

// 创建 express 的服务器实例
const app = express()

// 配置模板引擎
app.engine('html',require('express-art-template'))

// 导入日志
global.log = require('./log4js').logger
httpLogger = require('./log4js/index').httpLogger
app.use(httpLogger)

//优先创建 JSONP的接口 （这个接口不会被处理成 CORS接口）
app.get('/api/jsonp', (req, res) => {
    //1.获取客户端发送过来的回调函数的名字
    const funcName = req.query.callback
    //2.得到要通过 JSONP形式发送给客户端的数据
    const data = {name: 'zs', age: 22}
    //3.根据前两步得到的数据拼接出一个函数调用的字符串
    const scriptStr = `${funcName}(${JSON.stringify(data)})`
    //4.把上一步拼接得到的字符串响应给客户端的<script>标签进行解析执行
    res.send(scriptStr)
})

// 将 cors 注册为全局中间件
app.use(cors())

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json({
    type: "*/*"
}))

//配置解析表单数据的中间件
// app.use(express.urlencoded({extended: false}))


// 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const {expressjwt: expressJWT} = require('express-jwt')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
    expressJWT({secret: config.jwtSecretKey, algorithms: ['HS256']}).unless({
        // path: [/^\/api\/user\//],
        path: [/^\/api\/v1\/user\/login$/,/^\/api\/v1\/user\/regist$/],
    })
)

// 响应数据的中间件
app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin','http://example.cn') // 只允许来自example.cn请求
    res.setHeader('Access-Control-Allow', '*')
    //允许客户端额外向服务器发送Content-Type 请求头和 X-Custom-Header 请求头
    //注意：多个请求头之间使用英文的逗号进行分割
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,X-Custom-Header')

    // -1 认证失效，0 失败，,1 成功
    res.errMsg = function (err, code = '403', status = 1) {
        res.send({
            code: code,
            // 状态
            status: status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            msg: err instanceof Error ? err.message : err,
        })
    }
    res.errMsg = function (err) {
        res.send({
            code: '403',
            // 状态
            status: 0,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            msg: err instanceof Error ? err.message : err,
        })
    }
    res.success = function (code = '200', status = 0, msg = 'success', body) {
        res.send({
            code: code,
            // 状态
            status: status,
            msg: msg,
            data: body //isJsonString(body) ? body : JSON.stringify(body)
        })
    }
    res.success = function (body) {
        res.send({
            code: '200',
            // 状态
            status: 1,
            msg: 'success',
            data: body //isJsonString(body) ? body : JSON.stringify(body)
        })
    }
    next()
})

//在路由之前导入
const joi = require('joi')

// 导入并注册用户路由模块
const userRouter = require('./router/userRouter')
app.use('/api/v1/user', userRouter)

// 导入并注册任务路由模块
const taskRouter = require('./router/taskRouter')
app.use('/api/v1/task', taskRouter)

// 错误中间件，放在路由模块的后面
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) {
        log.error(err)
        return res.status(403).json({ code: '500', status: 0, msg: err.message })
    }
    // 捕获身份认证失败的错误，未授权
    if (err.name === 'UnauthorizedError') {
        log.error(err)
        log.debug(req.headers)
        res.status(401).json({ code: '401', status: -1, msg: err.message })
    }
    // 未知错误
    res.status(500).json({ code: '500', status: 0, msg: err.message })
})

// 404
app.use((req, res, next) => {
    res.send({code: '404', status: 0, msg: '404'})
    // res.render(__dirname + '/public/' +'404.html')
})

const sqliteDb = require("./db");
global.sqliteDB = sqliteDb

process.on('warning', e => log.warn(e.stack))
process.setMaxListeners(10)

// 调用 app.listen 方法，指定本地端口号8039 启动web服务器
const server = app.listen(8039, function () {
    const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    const host = server.address().address
    const port = server.address().port
    log.info(date + '  timekeeper-Server running at http://%s:%s', host, port)
})
