import getProductos from '../negocio/operaciones.js'

class ApiProductosMock {
    constructor() {}

    listar(cant = 5) {
        const prods = []
        for (let i = 0; i < cant; i ++) {
            const prod = getProductos()
            prods.push(prod)
        }

        return prods
    }
}

export default ApiProductosMock