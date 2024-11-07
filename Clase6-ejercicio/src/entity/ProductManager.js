import crypto from 'crypto'

export class ProductManager {

    constructor( {title,description, price, thumbnail, code, stock, path = './files/products.json'}) {
        //Pornerle los {} facilita la creación del producto.
        //No se le tiene que pasar en orden, sino que gracias a los nombres ya los acomoda.
        this.id = crypto.randomBytes(10).toString('hex')
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.path = path
    }
}