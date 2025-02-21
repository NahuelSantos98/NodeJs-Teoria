import { Router } from "express";
import {  productController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.route('/')
    .get(productController.getAllFiltered)
    .post(productController.createProduct)

productRouter.route('/:pid')
    .get(productController.getProductById)
    .put(productController.updateProductById)
    .delete(productController.deleteProductById)

    productRouter.param('pid', (req, res, next, pid)=>{
        if(pid) return next()
        return res.status(400).json({status: "Error",message: "Invalid id"})
    })

productRouter.get('*', (req, res)=>{
    res.status(404).json({status: 'error', message: 'No request for this endpoint for Product'})
})


export default productRouter;
