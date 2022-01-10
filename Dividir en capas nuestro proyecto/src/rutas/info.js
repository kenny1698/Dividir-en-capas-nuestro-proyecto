import { Router } from 'express'
import compression from 'compression'
import logger  from '../../log4js/log4js-module.js'
import PORT from '../server.js'
const routerInfo = new Router()

routerInfo.get('/info', (req, res)=>{
    logger.warn('get /info')
    const welcome = `Servidor expressen PORT ${PORT} -PID ${process.pid}`
    res.send(welcome.repeat(1000))
})

routerInfo.get('/infozip', compression(),(req, res)=>{
    logger.info('get /infozip')
    const welcome = `Servidor expressen PORT ${PORT} -PID ${process.pid}`
    res.send(welcome.repeat(1000))
})

export default routerInfo