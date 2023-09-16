/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/15 19:19
 * @File timekeeper_server/userMapper.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/

const {isEmpty} = require("../utils/Tools");
exports.selectUserByName = (name) => {
    return `select * from user where userName ='` + name + `'`
}

exports.insertUser = (user) => {
    const time = isEmpty(user.timeZone) ? 'UTC' : user.timeZone
    return sqliteDB.getSequelizeData().User.create({userName: user.userName, userPassword: user.userPassword, timeZone: time})
}
