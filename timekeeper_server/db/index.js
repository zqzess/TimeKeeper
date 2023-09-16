/**
 * ========================
 * Created with WebStorm.
 * @Author zqzess
 * @Date 2023/09/15 11:18
 * @File timekeeper_server/index.js
 * @Version :
 * @Desc :
 * @GitHUb Https://github.com/zqzess
 * ========================
 **/
const sqlite3 = require('sqlite3').verbose()
const {Sequelize, DataTypes} = require('sequelize')
const bcrypt = require('bcryptjs')
const {dbFileName, dbPath, passwordSalt} = require("../config");
const fs = require("fs")
const config = require("../config");
const {selectActiveTask} = require("../mapper/taskMapper");
const {checkScheduleTask} = require("../task/scheduleTask");

const dbFilePath = dbPath + '/' + dbFileName.replace('.db', '') + '.db'
const dbExist = fs.existsSync(dbFilePath)
if (!dbExist) {
    log.warn("Creating db file!")
    fs.mkdirSync(dbPath, {recursive: true})
    // fs.openSync(dbFilePath, 'w+')
}


let db = new sqlite3.Database(dbFilePath)

//执行sql语句
const runSql = async (sql) => {
    console.log(sql)
    return new Promise((resolve) => {
        db.run(sql, (err) => {
            resolve(err)
        })
    })
}

//查询
const queryPromise = async (sql) => {
    console.log(sql)
    return new Promise((resolve, reject) => {
        db.all(sql, function (err, rows) {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

const sequelizeInit = async () => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbFilePath,
        define: {
            freezeTableName: true,
        },
    })

    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }

    const User = sequelize.define('user', {
        userName: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: '',
            unique: true,
            validate: {
                notEmpty: true,
                min: 1,
                max: 63
            }
        },
        userPassword: {
            type: DataTypes.STRING(64),
            allowNull: true,
            defaultValue: '',
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: '',
        },
        loginIp: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '',
        },
        loginTime: {
            type: DataTypes.DATE,
            allowNull: true,
            // defaultValue: ''
        },
        timeZone: {
            type: DataTypes.STRING(64),
            allowNull: false,
            notEmpty: true,
            defaultValue: 'UTC',
        }
    })
    const Task = sequelize.define('task', {
        taskId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            notEmpty: true,
            unique: true
        },
        taskName: {
            type: DataTypes.STRING(64),
            allowNull: false,
            notEmpty: true
        },
        taskType: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        taskOptions: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        taskState: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        createUser: {
            type: DataTypes.STRING(64),
            allowNull: false,
            notEmpty: true
        }
    })
    await sequelize.sync()
    return {
        sequelize,
        User,
        Task
    }
}

let sequelize
let User
let Task

sequelizeInit().then((res) => {
    sequelize = res.sequelize
    User = res.User
    User.findAll().then(res =>{
        if(res.length < 1) {
            User.create({
                userName: 'root',
                userPassword: bcrypt.hashSync('root', passwordSalt),
                loginTime: new Date().toUTCString(),
                timeZone: 'UTC'
            })
        }
    })
    Task = res.Task
    queryPromise(selectActiveTask()).then(row => {
        if (row.length > 0) {
            row.forEach(function (task) {
                task.taskOptions = JSON.parse(task.taskOptions)
                const tasks = task.taskType.replace('，', ',').replace(' ', '').split(',')
                if (tasks[0].trim() === 'cron') {
                    checkScheduleTask(tasks, task)
                }
            })
        }
    })
})
const getSequelizeData = () => {
    return {
        sequelize,
        User,
        Task
    }
}

module.exports = {
    runSql,
    queryPromise,
    getSequelizeData,
}
