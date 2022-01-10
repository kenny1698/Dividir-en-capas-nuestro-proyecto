async function computoBloqueante(cant){
    const cantArray=[]
    const obj =[]
    let count = 1
    for(let i=0; i<cant; i++) {
        cantArray.push(Math.floor(Math.random() * (1000 - 1) + 1))
        }
    
    let unicos = [...new Set(cantArray)]
    
    for(let y=0; y<unicos.length; y++) {
        for(let x=0; x<cantArray.length; x++) {
            if(unicos[y] == cantArray[x] && x!=y)
                count++
        }
        obj.push({'random':unicos[y], 'cantidad':count})
        count = 1
    }
    return obj
}

import faker from 'faker'

faker.locale = 'es'

const getProductos = () => {
    return {
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        url: faker.random.image()
    }
}


export default {
    computoBloqueante,
    getProductos
}