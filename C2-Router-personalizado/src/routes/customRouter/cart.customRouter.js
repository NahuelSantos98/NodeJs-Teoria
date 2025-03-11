import { cartController } from "../../controllers/cart.controller.js";
import Router from "./class.customRouter.js";

export default class CartCustomRouter extends Router{
    init(){
        this.post('/', ['USER'], cartController.createCart)
        this.get('/', ['ADMIN'], cartController.getAllCarts)

        this.get('/:cid', ['USER'], cartController.getCartById)
        this.put('/:cid', ['USER'], cartController.updateProductsCart)
        this.delete('/:cid', ['USER'], cartController.removeAllProductsFromCart)
        
        this.get('/:cid/product/:pid', ['USER'], cartController.addProductToCart)
        this.put('/:cid/product/:pid', ['USER'], cartController.modifyQuantity)
        this.delete('/:cid/product/:pid', ['USER'], cartController.removeAllProductsFromCart)

        this.get('*', (req, res)=>{
            res.status(404).json({status: 'error', message: 'No request for this endpoint for Cart'})
        })
    }
}

export const cartCustomRouter = new CartCustomRouter()