import { Router } from "express";
import {__dirname} from '../path.js'
import { addProductToCart, createCart, getCartById, removeProductFromCart, removeAllProductsFromCart, getAllCarts, modifyQuantity, updateProductsCart } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/', createCart)

cartRouter.get('/:cid', getCartById)

cartRouter.get('/', getAllCarts)

cartRouter.post('/:cid/product/:pid', addProductToCart);

cartRouter.put('/:cid', updateProductsCart)

cartRouter.put('/:cid/product/:pid', modifyQuantity)

cartRouter.delete('/:cid/product/:pid', removeProductFromCart)

cartRouter.delete('/:cid', removeAllProductsFromCart)


export default cartRouter;