import { Router } from "express";
import {__dirname} from '../path.js'
import { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } from "../controllers/product.controller.js";

const productRouter = Router();


productRouter.get('/', getAllProducts);

productRouter.get('/:pid', getProductById)

productRouter.post('/', createProduct)

productRouter.put('/:pid', updateProductById)

productRouter.delete('/:pid', deleteProductById)


export default productRouter;
