import express from 'express';
import { promises as fs } from 'node:fs';
import { ProductManager } from './entity/ProductManager.js';
import { addProduct, getProducts, getProductById } from './utils/methods.js';

const app = express();
const PORT = 8080;
const RUTA = './files/products.json';

app.use(express.json()) //USAR PARA RECIBIR JSON
app.use(express.urlencoded({extended: true}))


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
// app.get('/create', async (req, res)=>{
//     let agregar = await addProduct(prod3)
//     res.send(`Se creo el producto: ${JSON.stringify(agregar)}`)
// })




app.post('/createProduct', async (req, res) => {
    let data = req.body

    if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })    
        //Si alguno de los datos no está, no crea el producto
    }

    try {
        if (data) {
            const productCreated = new ProductManager(data) //Crea la entidad del producto
            await addProduct(productCreated)   //Agrega el producto
            res.send({ status: "success", message: "Product created" }) //Devuelve el succes de creado
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: error.message }); //Envia el error 500 si algo sale mal
    }
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





let prod1 = new ProductManager("Arroz", "Hola esto es una descripcion del producto", 300, "https://www.artesust.com.ar/ImageSabrinaRecortadas/Esencia/Esencia1.jpg", 3000, 50);

app.listen(PORT, async () => {
    // Crear el archivo con el primer producto si no existe
    await createFile(RUTA, prod1);
    console.log("Server on port http://localhost:8080/");
});

