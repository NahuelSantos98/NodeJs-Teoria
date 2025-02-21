import { cartService } from '../services/cart.service.js';
import cartModel from '../models/cart.model.js'

class CartController {
    constructor(service) {
        this.service = service;

        this.getAllCarts = this.getAllCarts.bind(this);
        this.createCart = this.createCart.bind(this);
        this.getCartById = this.getCartById.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.updateProductsCart = this.updateProductsCart.bind(this);
        this.modifyQuantity = this.modifyQuantity.bind(this);
        this.removeProductFromCart = this.removeProductFromCart.bind(this);
        this.removeAllProductsFromCart = this.removeAllProductsFromCart.bind(this);
    }

    async getAllCarts(req, res, next) {
        try {
            const response = await this.service.getAllCarts();
            res.status(200).json({ status: "success", payload: response, message: 'Carts obtained successfully' })
        } catch (e) {
            console.error('An error occurred getAllCarts', e);
            next(e)
        }
    }

    async createCart(req, res, next) {
        try {
            let body = req.body
            if (!body) {
                return res.status(400).json({ status: "error", message: "All fields are required." })
            }
    
            const response = await this.service.createCart(body)
            res.status(201).json({ status: "success", payload: response, message: `Cart created successfully with id: ${response._id}` })
        } catch (e) {
            console.error('An error occurred createCart', e);
            next(e)
        }
    }

    async createCartForRegister() {
        try {
            const newCart = await this.service.createCartForRegister(); // Usamos el servicio
            if (!newCart) {
                return null;  // Si no se creó el carrito, devolvemos null
            }
            return newCart;  // Si el carrito se crea, devolvemos el carrito
        } catch (e) {
            console.error('An error occurred in createCartForRegister', e);
            return null;  // En caso de error, devolvemos null
        }
    }
    

    async getCartById(req, res, next) {
        try {
            let cartId = req.params.cid
    
            if (!cartId) {
                return res.status(400).json({ status: "error", error: "The id is undefined", message: "The Cart id must be provided" })
            }
    
            const cartFound = await cartModel.findOne({_id: cartId});
    
            if (!cartFound) {
                return res.status(404).json({ status: "error", error: `Cart with id: ${cartId} not found`, message: `Cart with id: ${cartId} not found` })
            }
    
            res.status(200).json({ status: "success", payload: cartFound, message: 'Cart found' })
        } catch (e) {
            console.error('An error occurred getCartById', e);
            next(e)
        }
    }

    async addProductToCart(req, res, next) {
        try {
            const cartId = req.params.cid;
            const prodId = req.params.pid;
            const { quantity } = req.body;
    
            if (!cartId) {
                return res.status(404).json({ status: "error", message: "The Cart Id must be provided" })
            }
    
            if (!prodId) {
                return res.status(404).json({ status: "error", message: "The Product Id must be provided" })
            }
    
            if (!quantity || typeof quantity !== "number" || quantity <= 0) {
                return res.status(400).json({ status: "error", error: "Invalid quantity", message: "Quantity must be a positive number" });
            }
    
            const response = await this.service.addProductToCart(cartId, prodId, quantity)
    
            res.status(200).json({ status: "success", message: "Cart updated successfully", payload: response });
    
        } catch (e) {
            console.error('An error occurre addProductToCart', e);
            next(e)
        }
    }

    async updateProductsCart(req, res, next) {
        try {
            let cartId = req.params.cid
            const productsArray = req.body
    
            if (!cartId) return res.status(400).json({ status: "error", message: "The Cart Id must be provided" });
    
            if (!Array.isArray(productsArray)) {
                return res.status(400).json({ status: "error", message: "The body provided is not an array" });
            }
            
            if (productsArray.length === 0) return res.status(400).json({ status: "error", message: "The body provided must not be empty" });
    
            for (let i = 0; i < productsArray.length; i++) {
                const prod = productsArray[i];
                if (!prod.prodId || typeof prod.quantity !== "number" || prod.quantity <= 0) {
                    return res.status(400).json({status: "error", message: "Each product must include a valid 'prodId' and a positive 'quantity'"});
                }
            }
    
            const response = await this.service.updateProductsCart(cartId, productsArray, res)
    
            res.status(200).json({ status: "success", message: `The products of the cart has been updated`, payload: response });
    
        } catch (e) {
            console.error('An error occurred updateProductsCart', e);
            next(e)
        }
    }

    async modifyQuantity(req, res, next) {
        try {
            let cartId = req.params.cid
            let prodId = req.params.pid
            
            const { quantity } = req.body
    
            if (!cartId) {
                return res.status(404).json({ status: "error", message: "The Cart Id must be provided" })
            }
    
            if (!prodId) {
                return res.status(404).json({ status: "error", message: "The Product Id must be provided" })
            }
    
            if (!quantity || typeof quantity !== "number" || quantity <= 0) {
                return res.status(400).json({ status: "error", message: "Quantity must be a positive number" });
            }
    
            let cartUpdated = await this.service.modifyQuantity(cartId, prodId, quantity, res)
    
            res.status(200).json({ status: "success", message: `Product ${prodId} quantity updated successfully`, payload: cartUpdated });
    
        } catch (e) {
            console.error('An error occurred modifyQuantity', e);
            next(e)
        }
    }

    async removeProductFromCart(req, res, next) {
        try {
            let cartId = req.params.cid;
            let prodId = req.params.pid;
    
            if (!cartId) {
                return res.status(400).json({ status: "error", error: "The cart id is undefined", message: "The Cart id must be provided" });
            }
    
            if (!prodId) {
                return res.status(400).json({ status: "error", error: "The product id is undefined", message: "The Product id must be provided" });
            }
    
            const response = await this.service.removeProductFromCart(cartId, prodId, res)
            res.status(200).json({ status: "success", message: `Product ${prodId} removed successfully`, payload: response });
        } catch (e) {
            console.error('An error occurred removeProductFromCart', e);
            next(e)
        }
    }

    async removeAllProductsFromCart(req, res, next) {
        try {
            let cartId = req.params.cid;
    
            if (!cartId) {
                return res.status(400).json({ status: "error", error: "The cart id is undefined", message: "The Cart id must be provided" });
            }
            const response = await this.service.removeAllProductsFromCart(cartId, res)
    
            res.status(200).json({ status: "success", payload: response, message: "The cart has been emptied" })
    
        } catch (e) {
            console.error('An error occurred removeAllProductsFromCart', e);
            next(e)
        }
    }
}

export const cartController = new CartController(cartService);



export const renderCart = async (req, res, next) => {
    try {
        let cartId = req.params.cid;

        if (!cartId) {
            return res.status(400).json({
                status: "error",
                error: "The id is undefined",
                message: "The Cart id must be provided"
            });
        }

        const cartFound = await cartModel.findOne({ _id: cartId }).lean();

        if (!cartFound) {
            return res.status(404).json({
                status: "error",
                error: `Cart with id: ${cartId} not found`,
                message: `Cart with id: ${cartId} not found`
            });
        }

        let productsCart = cartFound.products;

        res.status(200).render('templates/cart', { productsCart });
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({
            status: "error",
            error: e.message,
            message: 'An error occurred while retrieving carts'
        });
    }
};
