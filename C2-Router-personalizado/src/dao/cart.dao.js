import MongoDao from './mongo.dao.js';
import cartModel from '../models/cart.model.js';

class CartDao extends MongoDao {
    constructor() {
        super(cartModel);
    }

    async getAllCarts() {
        try {
            return await this.model.find();
        } catch (e) {
            throw new Error("Error retrieving carts");
        }
    }

    async createCart(body) {
        try {
            return await this.model.create(body);
        } catch (e) {
            throw new Error("Error creating cart");
        }
    }

    async createCartForRegister() {
        try {
            return await this.model.create({ products: [] });
        } catch (e) {
            throw new Error("Error creating cart");
        }
    }

    async getCartByIdPopulated(cartId) {
        try {
            return await this.model.findOne({ _id: cartId });
        } catch (e) {
            throw new Error("Error retrieving cart by id");
        }
    }

    async getCartById(cartId){
        try {
            return await this.model.findById({ _id: cartId });
        } catch (error) {
            throw new Error("Error retrieving cart by id");
        }
    }

    async addProductToCart(cart) {
        try {
            return await cart.save();
        } catch (e) {
            throw new Error("Error adding product to cart");
        }
    }

    async updateProductsCart(cart) {
        try {
            return await cart.save();
        } catch (e) {
            throw new Error("Error updating products in cart");
        }
    }

    async modifyQuantity(cart) {
        try {
            return await cart.save();
        } catch (e) {
            throw new Error("Error modifying product quantity in cart");
        }
    }

    async removeProductFromCart(cart) {
        try {
            return await cart.save();
        } catch (e) {
            throw new Error("Error removing product from cart");
        }
    }

    async removeAllProductsFromCart(cart) {
        try {
            return await cart.save();
        } catch (e) {
            throw new Error("Error removing all products from cart");
        }
    }
    
}

export const cartDao = new CartDao();
