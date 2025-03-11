import { productController } from "../../controllers/product.controller.js";
import Router from "./class.customRouter.js";
import { validateProduct, validateUpdateProduct } from "../../middlewares/productValidator.js";


export default class ProductCustomRouter extends Router{
    init(){
        this.get('/', ['PUBLIC'], productController.getAllFiltered)
        this.post('/', ['ADMIN'], validateProduct,productController.createProduct)
        //Como aplicar el middleware de validacion de productos


        this.get('/:pid', ['PUBLIC'], productController.getProductById)
        this.put('/:pid', ['ADMIN'],validateUpdateProduct ,productController.updateProductById) 
        //Como aplicar el middleware de validacion de productos
        this.delete('/:pid', ['ADMIN'], productController.deleteProductById)
        
        this.get('*', (req, res)=>{
            res.status(404).json({status: 'error', message: 'No request for this endpoint for Product'})
        })
    }
}

export const productCustomRouter = new ProductCustomRouter()