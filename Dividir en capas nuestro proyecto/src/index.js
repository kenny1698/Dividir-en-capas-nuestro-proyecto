const Contenedor = require('./persistencia/contenedores/Contenedor.js')
const { optionsMySQL } = require( './options/DBs.js')
const { optionsSQLite } = require( './options/DBs.js')

//const productos = new Contenedor(optionsMySQL)
const productos = new Contenedor(optionsSQLite)
const chat = new Contenedor(optionsSQLite)

productos.startProductos()
.then(() => {
return 
})
.catch((err) => { console.log(err); throw err })
  .finally(() => {
    productos.close()
  }) 


chat.startChat()
.then(() => {return})
.catch((err) => { console.log(err); throw err })
  .finally(() => {
    chat.close()
  })