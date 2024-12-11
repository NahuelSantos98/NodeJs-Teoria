import productModel from "../models/product.model.js";
import Product from "../entity/Product.js";

export const getAllProducts = async(req, res)=>{
    try {
        let limit = parseInt(req.query.limit) || 10;
        if (limit <= 0) limit = 10;
        const data = await productModel.find().limit(limit);
        if(!data.length){
            return res.status(404).json({
                success: false,
                message: `No products found`,
                error: "No products found"
            });
        }
        res.status(200).json({success: true, data: data, message: 'Products obtained successfully'})
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while retrieving products'});
    }
}

export const getProductById = async(req, res)=>{
    try {
        let prodId = req.params.pid
        if(!prodId){
            return res.status(400).json({success: false, error: "The id is undefined", message: "The Product id must be provided"})
        }
    
        let productFound = await productModel.findById(prodId)

        if(!productFound){
            return res.status(404).json({success: false, error: `Product with id: ${prodId} not found`, message: `Product with id: ${prodId} not found`})
        }

        res.status(200).json({ success: true, data: productFound, message: 'Product found' })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while retrieving the product'});
    }
}

export const createProduct = async(req, res)=>{
    try {
        let body = req.body

        if (!body || !body.title || !body.description || !body.code || !body.price || !body.stock || !body.category) {
            return res.status(400).json({success: false, error: "All required fields (title, description, code, price, stock, and category) are required.",  message: "All required fields (title, description, code, price, stock, and category) are required."})
        }
        const newProduct = new Product(body)
        const response = await productModel.create(newProduct)

        res.status(201).json({success: true, data: response, message: `Product created successfully with id: ${response.id}`})
        
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while creating the product'});
    }
}

export const modifyProductById = async(req, res)=>{
    try {
        let prodId = req.params.pid
        let updatedProduct = req.body

        if(!prodId){
            return res.status(400).json({success: false, error: "The Product Id must be provided" ,message: "The Product Id must be provided"})
        }
        if(!updatedProduct){
            return res.status(400).json({success: false, error: "At least one field is required to modify a product" ,message: "At least one field is required to modify a product"})
        }

        const response = await productModel.findByIdAndUpdate(prodId, updatedProduct, { new: true });
        //Se usa el new:true para que devuelva el ULTIMO registro (Osea el nuevo)

        res.status(200).json({success: true, data: response ,message: "Product modified successfully"})
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while modifying the product'});
    }
}

export const deleteProductById = async(req, res)=>{
    try {
        let prodId = req.params.pid
        if(!prodId){
            return res.status(400).json({success: false, error: "The Product Id must be provided" ,message: "The Product Id must be provided"})
        }
        
        const response = await productModel.findByIdAndDelete(prodId)
        
        res.status(200).json({ success: true, data: {}, message: `Product with id: ${prodId} has been deleted` })
    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while deleting the product'});
    }
}

export const getAllProductsByCategory = async(req, res)=>{
    try {
        const {category} = req.body

        if (!category || typeof category !== "string" || !category.trim()) {
            return res.status(400).json({
                success: false,
                error: "Invalid category",
                message: "The category must be a non-empty string."
            });
        }

        const response = await productModel.find({category: category.trim()})

        if (!response.length) {
            return res.status(404).json({
                success: false,
                message: `No products found for category: ${category}`,
                error: `No products found for category: ${category}`
            });
        }

        res.status(200).json({success: true, data: response, message:`Products with category: ${category}, obtained successfully`})

    } catch (e) {
        console.error('An error occurred', e);
        res.status(500).json({success: false, error: e.message, message: 'An error occurred while retrieving products by category.'});
    }
}