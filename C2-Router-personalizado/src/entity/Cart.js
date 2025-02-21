import { v4 as uuidv4 } from 'uuid';

class Cart {
    constructor({ products = [] } = {}) {
        this.id = uuidv4();
        this.products = Array.isArray(products) ? products : [products];
    }
}

export default Cart;