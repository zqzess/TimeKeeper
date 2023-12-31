const log4js = require('log4js')

// log4js的输出级别6个: trace, debug, info, warn, error, fatal
// log4js默认的日志级别如下：
// ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF

log4js.configure({

    //输出位置的基本信息设置

    appenders: {

        //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
        // 将日志输出到控制台，需要注意的一点是，大量日志写入控制台可能会使应用占用大量内存，可以考虑使用stdout
        out: { type: 'stdout' }, //console

        //设置每天：以日期为单位,数据文件类型，dataFiel 注意设置pattern，alwaysIncludePattern属性
        //allLog: { type: 'dateFile', filename: './log/all', pattern: '-yyyy-MM-dd.log', alwaysIncludePattern: true },

        //所有日志记录，文件类型file 文件最大值maxLogSize 单位byte (B->KB->M) backups:备份的文件个数最大值,最新数据覆盖旧数据,compress: true 超过maxLogSize，压缩代码
        allLog: { type: 'file', filename: './log/all.log', keepFileExt: true, maxLogSize: 10485760, backups: 3 },

        //pattern，默认为.yyyy-MM-dd， 用于确定何时滚动日志的模式，如果.yyyy-MM-dd-hh则以小时为单位滚动日志。格式:.yyyy-MM-dd-hh:mm:ss.log
        //http请求日志 http请求日志需要app.use引用一下， 这样才会自动记录每次的请求信息
        httpLog: { type: "dateFile", filename: "log/httpAccess.log", pattern: ".yyyy-MM-dd", keepFileExt: true },

        //错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
        errorLog: { type: 'file', filename: './log/error.log' },

        error: { type: "logLevelFilter", level: "error", appender: 'errorLog' }

    },

    //不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog'] categories 作为getLogger方法的键名对应
    categories: {

        //appenders:采用的appender,取上面appenders项,level:设置级别

        http: { appenders: ['out', 'httpLog'], level: "debug" },

        default: { appenders: ['out', 'allLog', 'error'], level: 'debug' }, //error写入时是经过筛选后留下的

    }

})

//getLogger参数取categories项,为空或者其他值取default默认项

// exports.getLogger = function (name) {

// return log4js.getLogger(name || 'default')

// }

const logger = log4js.getLogger("timekeeper-Server")

const httpLog = log4js.getLogger('http')

const httpLogger = log4js.connectLogger(httpLog, { level: 'WARN' })

exports = module.exports = { logger, httpLogger }
