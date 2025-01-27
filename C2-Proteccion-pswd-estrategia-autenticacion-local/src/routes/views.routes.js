import { Router } from "express";
import path from "path";
import { promises as fs } from 'node:fs';
import { __dirname } from "../path.js";
import { renderProducts, renderProductDetail } from "../controllers/product.controller.js";
import { renderCart } from "../controllers/cart.controller.js";

const viewsRouter = Router();

const productsPath = path.resolve(__dirname, 'db/products.json');

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const productsData = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    res.render('templates/realTimeProducts', { products });
});

viewsRouter.get('/products', renderProducts)

viewsRouter.get('/products/:pid', renderProductDetail)

viewsRouter.get('/carts/:cid', renderCart)

viewsRouter.get('/loginCookie', (req, res) => {
    res.render('templates/formCookie');
});

viewsRouter.get('/register', (req, res)=>{
    res.render('templates/formRegister');
})

viewsRouter.get('/login', (req, res)=>{
    res.render('templates/formLogin');
})

viewsRouter.get('/logout', (req, res)=>{
    res.render('templates/logout')
})

export default viewsRouter;
