import cartModel from '../models/cart.model.js'

export const getAllCarts = async (req, res) => {
    try {
        const response = await cartModel.find();
        res.status(200).json({ status: "success", payload: response, message: 'Carts obtained successfully' })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", error: e.message, message: 'An error occurred while retrieving products' });
    }
}

export const createCart = async (req, res) => {
    try {
        let body = req.body
        if (!body) {
            return res.status(400).json({ status: "error", message: "All fields are required." })
        }

        const response = await cartModel.create(body)
        res.status(201).json({ status: "success", payload: response, message: `Cart created successfully with id: ${response._id}` })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", error: e.message, message: 'An error occurred while creating the cart' });
    }
}

export const getCartById = async (req, res) => {
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
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", error: e.message, message: 'An error occurred while retrieving carts' });
    }
}

export const addProductToCart = async (req, res) => {
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

        const cartFound = await cartModel.findById(cartId)

        if (!cartFound) {
            return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });
        }

        const index = cartFound.products.findIndex(p => p.prodId == prodId)

        if (index != -1) {
            cartFound.products[index].quantity = quantity
        } else {
            cartFound.products.push({ prodId, quantity })
        }

        let cartUpdated = await cartFound.save()

        const response = await cartModel.findByIdAndUpdate(cartId, cartUpdated, { new: true })
        res.status(200).json({ status: "success", message: "Cart updated successfully", payload: response });

    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", error: e.message, message: 'An error occurred while adding the product to the cart' });
    }
}

export const updateProductsCart = async (req, res) => {
    try {
        let cartId = req.params.cid
        const productsArray = req.body
        console.log("Request body:", req.body);


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

        const cartFound = await cartModel.findById(cartId)

        if (!cartFound) return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });

        cartFound.products = productsArray

        let cartUpdated = await cartFound.save()

        res.status(200).json({ status: "success", message: `The products of the cart has been updated`, payload: cartUpdated });

    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", message: 'An error occurred while modifying the cart products' });
    }
}

export const modifyQuantity = async (req, res) => {
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

        const cartFound = await cartModel.findById(cartId)

        if (!cartFound) {
            return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });
        }

        const index = cartFound.products.findIndex(p => p.prodId._id == prodId) 
        //prodId es un objeto que contiene la info del producto (_id)

        if (index == -1) return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found ` })

        cartFound.products[index].quantity = quantity;

        let cartUpdated = await cartFound.save()

        res.status(200).json({ status: "success", message: `Product ${prodId} quantity updated successfully`, payload: cartUpdated });


    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ status: "error", message: 'An error occurred while modifying the product quantity' });
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        let cartId = req.params.cid;
        let prodId = req.params.pid;

        if (!cartId) {
            return res.status(400).json({ status: "error", error: "The cart id is undefined", message: "The Cart id must be provided" });
        }

        if (!prodId) {
            return res.status(400).json({ status: "error", error: "The product id is undefined", message: "The Product id must be provided" });
        }

        const cart = await cartModel.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).json({ status: "error", message: `Cart with id ${cartId} not found` });
        }

        const productIndex = cart.products.findIndex(p => p.prodId._id == prodId);

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            const updatedCart = await cart.save();
            return res.status(200).json({ status: "success", payload: updatedCart, message: `The product with id ${prodId} has been removed` });
        } else {
            return res.status(404).json({ status: "error", message: `Product with id ${prodId} not found in cart` });
        }

    } catch (e) {
        console.error('An error occurred', e);
        return res.status(500).json({
            status: "error",
            error: e.message,
            message: 'An error occurred while removing the Product from the Cart'
        });
    }
};

export const removeAllProductsFromCart = async (req, res) => {
    try {
        let cartId = req.params.cid;

        if (!cartId) {
            return res.status(400).json({ status: "error", error: "The cart id is undefined", message: "The Cart id must be provided" });
        }

        const cart = await cartModel.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).json({ status: "error", message: `Cart with id ${cartId} not found` });
        }

        cart.products = []

        let cartUpdated = await cart.save()

        res.status(200).json({ status: "success", payload: cartUpdated, message: "The cart has been emptied" })

    } catch (e) {
        console.error('An error occurred', e);
        return res.status(500).json({
            status: "error",
            error: e.message,
            message: 'An error occurred while removing the Product from the Cart'
        });
    }
}

export const renderCart = async (req, res) => {
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
