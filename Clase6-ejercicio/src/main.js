import express from 'express';
import { promises as fs } from 'node:fs';
import { ProductManager } from './entity/ProductManager.js';
import { addProduct, getProducts, getProductById } from './utils/methods.js';

const app = express();
const PORT = 8080;
const RUTA = './files/products.json';

let prod1 = new ProductManager("Arroz", "Hola esto es una descripcion del producto", 300, "https://www.artesust.com.ar/ImageSabrinaRecortadas/Esencia/Esencia1.jpg", 3000, 50);
let prod2 = new ProductManager("Leche", "Hola esto es una descripcion del producto", 500, "https://www.artesust.com.ar/ImageSabrinaRecortadas/Esencia/Esencia1.jpg", 1000, 20);
let prod3 = new ProductManager("Pan", "Hola esto es una descripcion del producto", 1000, "https://www.artesust.com.ar/ImageSabrinaRecortadas/Esencia/Esencia1.jpg", 7000, 10);



const createFile = async (ruta, prod) => {
    try {
        // Verificar si el archivo existe
        await fs.access(ruta);
    } catch {
        // Si no existe, lo crea e inserta el primer producto
        await fs.writeFile(ruta, JSON.stringify([prod], null, 2)); // Crear el archivo con el primer producto
    }
};


//Se tiene que hacer con un post (Mas adelante se corrige)
app.get('/create', async (req, res)=>{
    let agregar = await addProduct(prod3)
    res.end(`Se creo el producto: ${JSON.stringify(agregar)}`)
})

app.get('/products', async (req, res) => {
    res.json(await getProducts(RUTA));   // Devolver los productos en formato JSON
});

app.get('/product/:id', async (req, res) => {
    const prodId = req.params.id;
    try {
        const productFound = await getProductById(prodId, RUTA);
        res.json(productFound);  // Si lo encuentra, devuelve el producto
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error.message });  // Responde con un error 404 y el mensaje
    }
});

app.listen(PORT, async () => {
    // Crear el archivo con el primer producto si no existe
    await createFile(RUTA, prod1);
    console.log("Server on port http://localhost:8080/");
});

