import { Router } from 'express'
import compression from 'compression'
import logger  from '../../log4js/log4js-module.js'
import controlador from '../negocio/operaciones.js'
const routerRandom = new Router()

routerRandom.get('/api/randomsnoBloq', (req, res) => {
    let cant = req.query.cant
    const computo = fork(path.resolve(__dirname, 'computo.js'))
    if (cant != undefined)
      computo.send(cant)
    else
      computo.send(100000000)
    computo.on('message', resultado => {
        res.json({ resultado })
    })
  })

  routerRandom.get('/api/randomsBloq', (req, res) => {
    let cant = req.query.cant
    if (cant == undefined)
      cant = 100000000
    const resultado = controlador.computoBloqueante(cant)
    res.json({ resultado})
  })

  export default routerRandom 