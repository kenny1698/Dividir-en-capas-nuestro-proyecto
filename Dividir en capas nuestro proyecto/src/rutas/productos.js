import { Router } from 'express'
import logger  from '../../log4js/log4js-module.js'
import PORT from '../server.js'
import ApiProd from '../controlador/operaciones.js'
const ApiProductos = new ApiProd()
const productosFakes = ApiProductos.listar()
const routerProd = new Router()

routerProd.get('/api/productos-test', (req, res) => {
    res.render('tabla-productos', {productosFakes});
    
})