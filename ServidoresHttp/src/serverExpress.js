import express from 'express'
import { objectUser , users} from './utils/objectUser.js'


const app = express()
const PORT = 8080

app.use(express.urlencoded({extended: true}))


app.get("/", (req, res)=>{
    res.end("HOME")
})

app.get("/bienvenida", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end("<h1 style='color: blue;'>Hola BIENVENIDO a mi página</h1>");
});

app.get('/usuario', (req, res)=>{
    res.status(200).json(objectUser)
})

app.get('/user/:idUser', (req, res)=>{
    const idUser = parseInt(req.params.idUser) //Parsearlo para que pase de string a number

    const user = users.find(u=> u.id === idUser)

    if (user) {
        return res.status(200).json({ user });
    }

    res.status(404).send(`User con el ID: ${idUser} no fue encontrado.`);
})

app.get('/queries', (req, res)=>{
    let {nombre, apellido, edad} = req.query 
    res.end(`${nombre}, ${apellido}, ${edad}`)

    // http://localhost:8080/queries?nombre=nahuel&apellido=santos&edad=19
    // nahuel, santos, 19
})

app.get('/filtradoEdad', (req, res)=>{
    let {edad} = req.query

    const usersResponse = users.filter(u => u.edad <= parseInt(edad))
        
    res.json({usersResponse})
})

app.listen(PORT, ()=> console.log("Server on port http://localhost:8080/"))