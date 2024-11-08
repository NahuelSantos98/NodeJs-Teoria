import crypto from 'crypto'

export class Product{
    constructor({name, stock, price}) {
        this.id = crypto.randomBytes(10).toString('hex')
        this.name = name
        this.stock = stock
        this.price = price
    }
}