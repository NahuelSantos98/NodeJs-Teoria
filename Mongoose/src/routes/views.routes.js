import { Router } from "express";
import path from "path";
import { promises as fs } from 'node:fs';
import { __dirname } from "../path.js";

const viewsRouter = Router();

const productsPath = path.resolve(__dirname, 'db/products.json');

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const productsData = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsData);
    res.render('templates/realTimeProducts', { products });
});

export default viewsRouter;
