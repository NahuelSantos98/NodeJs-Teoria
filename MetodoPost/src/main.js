import express from 'express'

const app = express()
const PORT = 8080

app.use(express.json()) //El servidor puede recibir JSON al momento de las peticiones
app.use(express.urlencoded({extended: true})) 
//Permite a Express analizar los datos en el cuerpo de las solicitudes y los hace accesibles en req.body

let products = [] //Almacena productos

app.post('/api/createProduct', (req, res)=>{
    let data = req.body //Agarra el body

    if(!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock){    
        //Valida que este cada uno de los atributos
        return res.status(400).send({status: "error",error: "Incomplete values"}) 
        //Retorna error en caso de no cumplir con alguno
    }

    products.push(data) //Pushea el producto al array
    console.log(products);  //Muestra lso productos
    
    res.status(201).send({status:"success", message: "Product created"})    //Devuelve succes cuando se crea.
})


app.listen(PORT, ()=> {
    console.log("Server on port http://localhost:8080/")
})