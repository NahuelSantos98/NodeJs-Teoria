import { Router } from "express";
import {__dirname} from '../path.js'
import {cartController} from "../controllers/cart.controller.js";

const cartRouter = Router()


cartRouter.route('/')
    .post(cartController.createCart)
    .get(cartController.getAllCarts)

cartRouter.route('/:cid')
    .get(cartController.getCartById)
    .put(cartController.updateProductsCart)
    .delete(cartController.removeAllProductsFromCart)

cartRouter.route('/:cid/product/:pid')
    .post(cartController.addProductToCart)
    .put(cartController.modifyQuantity)
    .delete(cartController.removeProductFromCart)

    cartRouter.param('cid', (req, res, next, cid)=>{
        if(cid) return next()
        return res.status(400).json({status: "Error",message: "Invalid Cart id"})
    })

    cartRouter.param('cid', (req, res, next, pid)=>{
        if(pid) return next()
        return res.status(400).json({status: "Error",message: "Invalid Product id"})
    })


cartRouter.get('*', (req, res)=>{
    res.status(404).json({status: 'error', message: 'No request for this endpoint for Cart'})
})

export default cartRouter;