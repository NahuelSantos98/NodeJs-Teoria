import { Router } from "express";
import { promises as fs } from 'node:fs'
import {__dirname} from '../path.js'
import path from 'path';
import Product from "../entity/Product.js";
import { productModel } from "../models/products.models.js";
import { error } from "node:console";

const productRouter = Router();

const productsPath = path.resolve(__dirname, 'db/products.json');
const productsData = await fs.readFile(productsPath, 'utf-8');
const products = JSON.parse(productsData);


productRouter.get('/', (req, res) => {
    let limit = parseInt(req.query.limit) || 10
    let productsLimited = products.slice(0, limit)
    res.status(200).render('templates/index', {productsLimited})
});

productRouter.get('/:pid', (req, res) => {
    let prodId = req.params.pid

    if(!prodId){
        return res.status(404).json({status: "error", message: "The Product Id must be provided"})
    }

    let productFound = products.find(p => p.id == prodId)

    if (!productFound) {
        return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found` })
    }

    res.status(200).json({ status: "success", data: productFound })
})

productRouter.post('/', async (req, res) => {
    let body = req.body

    if (!body || !body.title || !body.description || !body.code || !body.price || !body.stock || !body.category) {
        return res.status(400).json({status: "error", message: "All required fields (title, description, code, price, stock, and category) are required."})
    }

    try {
        let newProduct = new Product(body)
        products.push(newProduct)

        await fs.writeFile(productsPath, JSON.stringify(products, null, 2), "utf-8")
        res.status(201).json({status: "success", message: `The product has been created with id: ${newProduct.id}`, data: newProduct})
    } catch (e) {
        console.error('Error saving the product:', error);
        res.status(500).json({status: "error", message: "Internal server error. Please try again later."})
    }
})

productRouter.put('/:pid', async (req, res) => {
    let prodId = req.params.pid
    let { title, description, code, price, status, stock, category, thumbnails } = req.body

    let productToModify = products.find(p => p.id === prodId)

    if(!prodId){
        return res.status(404).json({status: "error", message: "The Product Id must be provided"})
    }

    if (!productToModify) {
        return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found` })
    }

    productToModify.title = title || productToModify.title
    productToModify.description = description || productToModify.description
    productToModify.code = code || productToModify.code
    productToModify.price = price || productToModify.price
    productToModify.status = status || productToModify.status
    productToModify.stock = stock || productToModify.stock
    productToModify.category = category || productToModify.category
    productToModify.thumbnails = thumbnails || productToModify.thumbnails

    try {
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2), "utf-8")
        res.status(200).json({status: "success", message: "Product modified successfully", data: productToModify})
    } catch (e) {
        console.error("Error modifying the product: ", e);
        res.status(500).json({status: "error", message: "Internal server error. Please try again later."})
    }
})

productRouter.delete('/:pid', async (req, res) => {
    let prodId = req.params.pid

    if(!prodId){
        return res.status(404).json({status: "error", message: "The Product Id must be provided"})
    }

    let findProduct = products.find(p=> p.id === prodId)
    
    if (!findProduct) {
        return res.status(404).json({ status: "error", message: `Product with id ${prodId} not found` })
    }

    let updatedProducts = products.filter((p) => p.id !== prodId)

    products.length = 0
    products.push(...updatedProducts)

    try {
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8')
        res.status(200).json({ status: "succesful", message: `Product with id: ${prodId} has been deleted` })
    } catch (e) {
        console.error("Error deleting the product:", error);
        res.status(500).json({status: "error",message: "Internal server error. Please try again later."})
    }
})


productRouter.get('/mongoose', async(req, res)=>{
    try {
        let resultDBMongoose = await productModel.find() //Es el get de el mongoose
        res.send({result: "success",data: resultDBMongoose})
    } catch (e) {
        console.error('No se pudo traer de mongoose', e)
    }
})


export default productRouter;