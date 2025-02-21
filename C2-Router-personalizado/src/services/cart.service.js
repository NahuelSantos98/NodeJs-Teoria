import { cartDao } from '../dao/cart.dao.js';

class CartService {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllCarts() {
        try {
            const response = await this.dao.getAllCarts();
            if (!response) throw new Error("Carts not found"); 
            return response;
        } catch (error) {
            throw new Error("Error retrieving all carts: " + error.message);
        }
    }

    async createCart(body) {
        try {
            const response = await this.dao.createCart(body);
            if (!response) throw new Error("Cart not created"); 
            return response;
        } catch (error) {
            throw new Error("Error creating cart: " + error.message);
        }
    }

    async createCartForRegister(){
        try {
            const response = await this.dao.createCartForRegister();
            if (!response) throw new Error("Cart not created"); 
            return response;
        } catch (error) {
            throw new Error("Error creating cart: " + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const response = await this.dao.getCartByIdPopulated(cartId);
            if (!response) throw new Error("Cart not found"); 
            return response;
        } catch (error) {
            throw new Error("Error retrieving cart by ID: " + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity, res) {
        try {
            const cart = await this.dao.getCartById(cartId)
            if(!cart) {
                res.status(404).json({status: "error", message: "Cart Not Found"})
                throw new Error("Cart Not found")
            };

            const index = cart.products.findIndex(p => p.prodId.toString() === productId.toString());
            if (index !== -1) {
                cart.products[index].quantity = quantity;
            } else {
                cart.products.push({ prodId: productId, quantity });
            }
            
            const response = this.dao.addProductToCart(cart)
            if (!response) throw new Error("Product not added"); 
            return response;
        } catch (error) {
            throw new Error("Error adding product to cart: " + error.message);
        }
    }

    async updateProductsCart(cartId, productsArray, res) {
        try {
            const cartFound = await this.dao.getCartById(cartId)
    
            if (!cartFound) return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });
    
            cartFound.products = productsArray

            const response = await this.dao.updateProductsCart(cartFound);
            if (!response) throw new Error("Products from Cart not updated"); 
            return response;
        } catch (error) {
            throw new Error("Error updating products in cart: " + error.message);
        }
    }

    async modifyQuantity(cartId, prodId, quantity, res) {
        try {
            const cartFound = await this.dao.getCartById(cartId)
            if (!cartFound) {
                return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });
            }
    
            const index = cartFound.products.findIndex(p => p.prodId._id == prodId) 
            //prodId es un objeto que contiene la info del producto (_id)
    
            if (index == -1) return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found ` })
    
            cartFound.products[index].quantity = quantity;

            const response = await this.dao.modifyQuantity(cartFound);

            if (!response) throw new Error("Product quantity not modified"); 
            return response;
        } catch (error) {
            throw new Error("Error modifying product quantity in cart: " + error.message);
        }
    }

    async removeProductFromCart(cartId, prodId, res) {
        try {
            const cart = await this.dao.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ status: "error", message: `Cart with id ${cartId} not found` });
            }
    
            const productIndex = cart.products.findIndex(p => p.prodId._id == prodId);
    
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                const response = await this.dao.removeProductFromCart(cart)
                if (!response) throw new Error("Product not removed"); 
                return response;
            } else {
                return res.status(404).json({ status: "error", message: `Product with id ${prodId} not found in cart` });
            }
        } catch (error) {
            throw new Error("Error removing product from cart: " + error.message);
        }
    }

    async removeAllProductsFromCart(cartId, res) {
        try {
            const cart = await this.dao.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ status: "error", message: `Cart with id ${cartId} not found` });
            }
    
            cart.products = []
    
            let cartUpdated = await cart.save()
            const response = await this.dao.removeAllProductsFromCart(cartUpdated);
            if (!response) throw new Error("Products not removed"); 
            return response;
        } catch (error) {
            throw new Error("Error removing all products from cart: " + error.message);
        }
    }
}

export const cartService = new CartService(cartDao);
