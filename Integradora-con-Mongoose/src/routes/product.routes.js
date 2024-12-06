import { Router } from "express";
import {__dirname} from '../path.js'
import {getAllProducts, getProductById, createProduct, modifyProductById, deleteProductById} from '../controller/product.controller.js'

const productRouter = Router();

productRouter.get('/', getAllProducts);

productRouter.get('/:pid', getProductById)

productRouter.post('/', createProduct)

productRouter.put('/:pid', modifyProductById)

productRouter.delete('/:pid',deleteProductById)


export default productRouter;