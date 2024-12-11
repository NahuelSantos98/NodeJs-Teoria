import cartModel from '../models/cart.model.js'
import Cart from '../entity/Cart.js'
import mongoose from 'mongoose';


export const getAllCarts = async (req, res) => {
    try {
        const data = await cartModel.find();
        res.status(200).json({ success: true, data: data, message: 'Carts obtained successfully' })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ success: false, error: e.message, message: 'An error occurred while retrieving products' });
    }
}



export const createCart = async (req, res) => {
    try {
        let body = req.body
        if (!body) {
            return res.status(400).json({ status: "error", message: "All fields are required." })
        }
        const newCart = new Cart(body)
        const response = await cartModel.create(newCart)
        res.status(201).json({ success: true, data: response, message: `Cart created successfully with id: ${response.id}` })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ success: false, error: e.message, message: 'An error occurred while creating the cart' });
    }
}

export const getCartById = async (req, res) => {
    try {
        let cartId = req.params.cid

        if (!cartId) {
            return res.status(400).json({ success: false, error: "The id is undefined", message: "The Cart id must be provided" })
        }

        const cartFound = await cartModel.findById(cartId);

        if (!cartFound) {
            return res.status(404).json({ success: false, error: `Cart with id: ${cartId} not found`, message: `Cart with id: ${cartId} not found` })
        }

        res.status(200).json({ success: true, data: cartFound, message: 'Cart found' })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ success: false, error: e.message, message: 'An error occurred while retrieving carts' });
    }
}


//Creo 1 producto en la BBDD, lo sumo al carrito todo ok, le cambio el quantity todo ok
//Cuando NO existe ese producto, lo crea pero sin el prodId:
// {
//     "success": true,
//     "message": "Cart updated successfully",
//     "data": {
//         "_id": "675289228df72266fed125e1",
//         "products": [
//             {
//                 "prodId": "675286004c9465695d1181ff",
//                 "quantity": 24,
//                 "_id": "675289338df72266fed125e5"
//             },
//             {
//                 "quantity": 10,
//                 "_id": "675289408df72266fed125eb"
//             }
//         ],
//         "__v": 0
//     }
// }
export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const { quantity } = req.body;

        if (!cartId) {
            return res.status(404).json({ success: false, error: "The Cart Id must be provided", message: "The Cart Id must be provided" })
        }

        if (!prodId) {
            return res.status(404).json({ success: false, error: "The Cart Id must be provided", message: "The Product Id must be provided" })
        }

        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ success: false, error: "Invalid quantity", message: "Quantity must be a positive number" });
        }

        const cartFound = await cartModel.findById(cartId)

        if (!cartFound) {
            return res.status(404).json({ success: false, error: "The Cart Id must be provided", message: `Cart with id: ${cartId} not found` });
        }

            //Consulto si el producto existe o no en el carrito
            const index = cartFound.products.findIndex(p => p.prodId == prodId)

            if(index != -1) {//findIndex devuelve -1 si no lo encuentra
                cartFound.products[index].quantity = quantity //Actualizo cantidad
            } else {
                cartFound.products.push({ prodId, quantity: quantity}) //Creo el producto
            }

            const response = await cartModel.findByIdAndUpdate(cartId, cartFound, {new: true}) //Guardando los cambios
            res.status(200).json({ success: true, message: "Cart updated successfully", data: response });

    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ success: false, error: e.message, message: 'An error occurred while adding the product to the cart' });
    }
}

export const deleteCartById = async (req, res) => {
    try {
        let cartId = req.params.cid
        if (!cartId) {
            return res.status(404).json({ success: false, error: "The Cart Id must be provided", message: "The Cart Id must be provided" })
        }

        const response = await cartModel.findByIdAndDelete(cartId)

        res.status(200).json({ success: true, data: {}, message: `Cart with id: ${cartId} has been deleted` })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({ success: false, error: e.message, message: 'An error occurred while deleting the Cart' });
    }
}