/**
 * 在这里定义和用户相关的路由处理函数，供 /router/userSchema.js 模块进行调用
 */

const bcrypt = require('bcryptjs') // 密码加密
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

const tools  =require('../utils/Tools')
const {selectUserByName, insertUser} = require("../mapper/userMapper");

// 注册用户的处理函数
exports.registUser = (req, res) => {
    const userinfo = req.body
    log.debug('注册api-接收', userinfo)
    // 判断数据是否合法
    if (!userinfo.userName || !userinfo.userPassword) {
        log.info('注册-用户名或密码为空')
        return res.errMsg('用户名或密码不能为空!')
    }
    userinfo.userPassword = bcrypt.hashSync(userinfo.userPassword, config.passwordSalt)
    sqliteDB.queryPromise(selectUserByName(userinfo.userName)).then(row => {
        if (row.length > 0) {
            return res.errMsg('用户已存在')
        }
        else {
            insertUser(userinfo)
            return res.success()
        }
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    log.debug('登陆api-接收', userinfo)
    // 判断数据是否合法
    if (!userinfo.userName || !userinfo.userPassword) {
        log.info('登陆-用户名或密码为空')
        return res.errMsg('用户名或密码不能为空!')
    }
    const sql = `select * from user where userName ='` + userinfo.userName + `'`
    sqliteDB.queryPromise(selectUserByName(userinfo.userName)).then(row => {
        if (row.length === 1) {
            // 拿着用户输入的密码,和数据库中存储的密码进行对比
            try {
                const compareResult = bcrypt.compareSync(userinfo.userPassword, row[0].userPassword)
                if (row[0].userName === userinfo.userName && compareResult) {
                    // 在登录处理函数中后续接上：生成 Token 字符串
                    let user = userinfo
                    user.timeZone = row[0].timeZone
                    user.userPassword ? user.userPassword = '' : user.userPassword
                    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
                        expiresIn: config.expiresIn, // token 有效期为 10 个小时
                    })
                    const userIP =  tools.getClientIp(req)
                    log.debug(userIP)
                    // return res.send({status: 0, message: '登陆成功！', token: 'Bearer ' + tokenStr})
                    return res.success({token: 'Bearer ' + tokenStr})
                } else {
                    return res.errMsg('用户名或密码错误')
                }
            }catch (e) {
                log.error(e)
                return res.errMsg('服务器出错了')
            }

        } else {
            return res.errMsg('账户不存在，请先注册')
        }
    }).catch(err => {
        if (err) return res.errMsg(err.message)
    })
}

