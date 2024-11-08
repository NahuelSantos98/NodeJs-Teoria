import express from 'express';
import { promises as fs } from 'node:fs';
import { ProductManager } from './entity/ProductManager.js';
import { addProduct, getProducts, getProductById, putProduct, deleteProduct } from './utils/methods.js';

const app = express();
const PORT = 8080;
const RUTA = './files/products.json';

app.use(express.json()) //USAR PARA RECIBIR JSON
app.use(express.urlencoded({extended: true}))


const createFile = async (ruta) => {
    try {
        await fs.access(ruta);
    } catch {
        await fs.writeFile(ruta, "");
    }
};


//Se tiene que hacer con un post (Mas adelante se corrige)
// app.get('/create', async (req, res)=>{
//     let agregar = await addProduct(prod3)
//     res.send(`Se creo el producto: ${JSON.stringify(agregar)}`)
// })




app.post('/api/createProduct', async (req, res) => {
    let data = req.body

    if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock) {
        return res.status(404).send({ status: "error", message: "Falta algun valor" })    
        //Si alguno de los datos no está, no crea el producto
    }

    try {
        if (data) {
            const productCreated = new ProductManager(data) //Crea la entidad del producto
            await addProduct(productCreated)   //Agrega el producto
            res.status(201).send({ status: "success", message: `Producto creado con el id: ${productCreated.id}` }) //Devuelve el succes de creado
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: error.message }); //Envia el error 500 si algo sale mal
    }
})





app.get('/api/products', async (req, res) => {
    res.json(await getProducts(RUTA));   // Devolver los productos en formato JSON
    //No uso el try-catch ya que devuelve un [] si hay un error.
});





app.get('/api/product/:id', async (req, res) => {
    const prodId = req.params.id;
    try {
        const productFound = await getProductById(prodId, RUTA);
        res.json(productFound);  // Si lo encuentra, devuelve el producto
    } catch (error) {
        console.error(error);
        res.status(404).json({status: "error", message: error.message });  // Responde con un error 404 y el mensaje
    }
});

app.put('/api/putProduct', async (req, res) => {
    const data = req.body;

    if (!data || !data.id) {
        return res.status(400).json({ status: "error", message: "El id o la data no fueron otorgadas" });
    }

    try {
        const modifiedProduct = await putProduct(data, RUTA);   
        //Agarra el producto modificado retornado
        res.json({ status: "success", product: modifiedProduct });
    } catch (error) {
        console.error(error);
        res.status(404).json({ status: "error", message: error.message });
    }
});


app.delete('/api/deleteProduct/:id', async(req, res) => {
    let idProduct = req.params.id   //Agarra del param el id

    if (!idProduct) {
        return res.status(400).json({ status: "error", message: "No se pasó el id en la url" })
    }

    try {
        await deleteProduct(idProduct, RUTA)
        res.status(200).json({status: "success", message: "Producto eliminado"})
    } catch (error) {
        console.error(error);
        res.status(404).json({status: "error", message: error.message})
    }
})



app.listen(PORT, () => {
    // Crear el archivo con el primer producto si no existe
    createFile(RUTA)
    console.log("Server on port http://localhost:8080/");
});

