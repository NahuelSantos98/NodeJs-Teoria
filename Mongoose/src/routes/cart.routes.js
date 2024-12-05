import { Router } from "express";
import { promises as fs } from 'node:fs'
import {__dirname} from '../path.js'
import path from 'path';
import Cart from "../entity/Cart.js";

const cartRouter = Router()

const cartsPath = path.resolve(__dirname, 'db/carts.json');
const cartsData = await fs.readFile(cartsPath, 'utf-8');
const carts = JSON.parse(cartsData);


cartRouter.post('/', async(req, res)=>{
    let body = req.body

    if (!body) {
        return res.status(400).json({status: "error", message: "All fields are required."})
    }

    const createCart = new Cart(body)

    carts.push(createCart)

    try {
        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), 'utf-8')
        res.status(201).json({status: "success", message: `The cart has been created with id: ${createCart.id}`, data: createCart})
    } catch (e) {
        console.error('Error saving the product:', e);
        res.status(500).json({status: "error", message: "Internal server error. Please try again later."})
    }
})

cartRouter.get('/:cid', async(req, res)=>{
    let cartId = req.params.cid
    let cartFound = carts.find(c=> c.id === cartId)

    if(!cartId){
        return res.status(404).json({status: "error", message: "The Cart Id must be provided"})
    }
    if (!cartFound) {
        return res.status(404).json({ status: "error", message: `Cart with id: ${prodId} not found` })
    }

    res.status(200).json({ status: "success", data: cartFound })
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const { quantity } = req.body;

    if(!cartId){
        return res.status(404).json({status: "error", message: "The Cart Id must be provided"})
    }

    if(!prodId){
        return res.status(404).json({status: "error", message: "The Product Id must be provided"})
    }

    const cartToAdd = carts.find(c => c.id === cartId);

    if (!cartToAdd) {
        return res.status(404).json({ status: "error", message: `Cart with id: ${cartId} not found` });
    }

    let productExists = cartToAdd.products.find(p => p.id === prodId);

    if (productExists) {
        productExists.quantity = quantity;
    } else {
        cartToAdd.products.push({ id: prodId, quantity });
    }

    try {
        await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), 'utf-8');
        res.status(200).json({ status: "success", message: "Cart updated successly", data: productExists });
    } catch (error) {
        console.error("Error saving the cart:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


export default cartRouter;