import express from 'express'
import http from 'http'
import { Server } from "socket.io"
import moment from 'moment'
import DBs from  '../options/DBs.js'
import Contenedor from './persistencia/contenedores/Contenedor.js'
import { json } from 'express'
// const ApiProductosMock from('./mocks/api/productos.js')
import handlebars from 'express-handlebars'
import { normalize, schema } from "normalizr"

const contChat = new Contenedor(DBs.optionsSQLite)
//const contProd = new Contenedor(optionsMySQL)
const contProd = new Contenedor(DBs.optionsSQLite)

const fecha = moment().format("DD/MM/YYYY HH:mm:ss"); 
import routerDatos from "./rutas/datos.js"
import routerInfo from "./rutas/info.js"
import routerRandom from "./rutas/random.js"
import flash from 'connect-flash'
import { fork } from 'child_process'
import cluster from 'cluster'
import os from 'os'
const numCPUs = os.cpus().length
import logger  from '../log4js/log4js-module.js'
import yargs from 'yargs'
const args = yargs(process.argv.slice(2))
  .default({
    port: 8080,
    modo: 'FORK'
  })
 .argv
 //--puerto 8081

//console.log(args[PORT], options);

const app = express()

//app.use(express.urlencoded())

app.use(flash())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//const httpServer = new HttpServer(app)
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use('/', routerDatos)
app.use('/', routerInfo)
app.use('/', routerRandom)

app.use(express.urlencoded({ extended: true }))

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: "./public/views/layouts",
        partialsDir:  "./public/views/partials"
    })
)

app.set('views', './public/views')
app.set('view engine', 'hbs')

const productos = []
const mensajes = []

//contChat.start()
//contProd.start()

contProd.getAll('productos')
    .then((result) =>{
        for (const obj in result) {
            productos.push(result[obj])
            }        
    })
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
    })

contChat.getAll('chat')
     .then((result) =>{
        for (const obj in result) {
            mensajes.push(result[obj])
            }    
     })
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        //contProd.close()
    })

// const ApiProductos = new ApiProductosMock()
// const productosFakes = ApiProductos.listar()

io.on('connection',async socket => {
    console.log('Nuevo cliente conectado!')
    const chatMensajes = {id:'mensajes', mensajes:mensajes}
    const authorSchema = new schema.Entity('authors');
    const chatSchema = new schema.Entity('chat', {
    author: authorSchema,
})

const normalizedChat= normalize(chatMensajes, chatSchema)

socket.emit('mensajes', normalizedChat)
    
socket.on('mensaje',  data =>  {
    try {
        const msj = {fecha, author: JSON.stringify(data.author), text:data.text}
        mensajes.push(msj)
        io.sockets.emit('mensajes', mensajes) 
        contChat.save(msj, 'chat')
        .then(() => {
            return 
        })
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
        })
    } catch(err) {
        console.log(err)  
    }
})

socket.emit('productos', productos)

socket.on('producto', data => {
    try {
        productos.push(data)
        io.sockets.emit('productos', productos)
        contProd.save([data], 'productos')
        .then(() => {
            return 
        })
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
        })
        
    } catch(err) {
        console.log(err)  
    }
    })
})

const PORT = process.env.PORT || 8080
const modo = process.argv[3] || 'FORK'
const modoCluster = modo == 'CLUSTER'

if (modoCluster && cluster.isMaster) {
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
  } else {

    const connectedServer = httpServer.listen(PORT, function () {
        logger.info(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
    })
    
    connectedServer.on('error', error => logger.error(`Error en servidor ${error}`))

    logger.info(`Worker ${process.pid} started`)
}

export default {PORT}

