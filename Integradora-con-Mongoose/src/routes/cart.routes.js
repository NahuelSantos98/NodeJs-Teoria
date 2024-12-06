import { Router } from "express";
import {createCart, getCartById, addProductToCart, deleteCartById, getAllCarts} from '../controller/cart.controller.js';

const cartRouter = Router()

cartRouter.post('/', createCart)

cartRouter.get('/', getAllCarts)

cartRouter.get('/:cid', getCartById)

cartRouter.post('/:cid/product/:pid', addProductToCart);

cartRouter.delete('/:cid', deleteCartById)


export default cartRouter;