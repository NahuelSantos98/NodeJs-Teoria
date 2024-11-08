import express from 'express'
import { Product } from './entity/Product.js'

const app = express()
const PORT = 8080

app.use(express.json()) //El servidor puede recibir JSON al momento de las peticiones
app.use(express.urlencoded({ extended: true }))
//Permite a Express analizar los datos en el cuerpo de las solicitudes y los hace accesibles en req.body

let products = [] //Almacena productos

app.get('/api/products', (req, res) => {
    return res.json(products)
})

app.post('/api/createProduct', (req, res) => {
    let data = req.body //Agarra el body

    if (!data.name || !data.price || !data.stock) {
        //Valida que este cada uno de los atributos
        return res.status(400).send({ status: "error", error: "Incomplete values" })
        //Retorna error en caso de no cumplir con alguno
    }

    try {
        const productoCreado = new Product(data)
        products.push(productoCreado) //Pushea el producto al array
        console.log(products);  //Muestra lso productos
        res.status(201).send({ status: "success", message: "Product created" }) //Devuelve succes cuando se crea.
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al crear producto" })
    }

})


app.put('/api/putProduct', async (req, res) => {
    let data = req.body;

    if (!data || !data.id) {
        return res.status(400).json({ error: "Product data or ID is missing" });
        //Si no existe la data o no se envía el id, devuelve un error.
    }

    let productToModify = products.find(p => p.id === data.id)

    if (!productToModify) {
        return res.status(404).json({ error: "Product not Found" });
        //Si no lo encuentra, retorna un error
    }

    //Modifica el valos si es que se pasa el valor. Si no se pasa, se deja ese valor igual como estaba.
    productToModify.name = data.name || productToModify.name
    productToModify.price = data.price || productToModify.price
    productToModify.stock = data.stock || productToModify.stock

    res.json(productToModify) //Devuelve el producto.
})

app.delete('/api/deleteProduct/:id', (req, res) => {
    let idProduct = req.params.id   //Agarra del param el id

    let modifiedArray = products.filter(p => p.id !== idProduct)    
    //Filtra el array para que solo esten los productos con DIFERENTE id al otorgado

    if (!modifiedArray) {
        return res.status(404).json({ status: "error", message: "Product Not Found" })
    }
    //Si no lo encuentra, que lo devuelva

    products = modifiedArray    
    //Asigna el valor modificado (Sin el producto) al array de products 

    return res.status(200).json({ status: 'success', message: "The product has been deleted" })
    //Uso del status 200 para que devuelva el message. Usando 204 (No content) no devuelve nada.
})


app.listen(PORT, () => {
    console.log("Server on port http://localhost:8080/")
})