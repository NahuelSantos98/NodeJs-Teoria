import { Router } from "express";
import {userCustomRouter} from "./user.customRouter.js";
import {productCustomRouter} from "./product.customRouter.js";
import { cartCustomRouter } from "./cart.customRouter.js";

const customRouter = Router()

customRouter.use('/user', userCustomRouter.getRouter());
customRouter.use('/products', productCustomRouter.getRouter());
customRouter.use('/carts', cartCustomRouter.getRouter());

export default customRouter