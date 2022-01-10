import log4js from 'log4js'
import pkg from 'mime';
const { default_type } = pkg;

log4js.configure({
    appenders: {
        consola: { type: "console" },
        warn: { type: 'file', filename: 'warn.log' },
        error: { type: 'file', filename: 'error.log' },
        loggerWarn: { type: 'logLevelFilter', appender: 'warn', level: 'warn' },
        loggerError: { type: 'logLevelFilter', appender: 'error', level: 'error' }
    },
    categories: {
        default: { appenders: ["consola"], level: "trace" },
        todos: { appenders: ['consola','loggerWarn', 'loggerError'], level: "all" }
    }
   })

   export default log4js.getLogger('todos')
