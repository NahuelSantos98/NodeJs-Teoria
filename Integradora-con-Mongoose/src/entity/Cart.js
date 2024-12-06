
class Cart {
    constructor({ products = [] } = {}) {
        this.products = Array.isArray(products) ? products : [products];
    }
}

export default Cart;