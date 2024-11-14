import { Router } from "express";

const viewsRouter = Router()

let users = [
    {
        id: 1,
        name: 'Nahuel',
        last_name: 'Santos',
        age: 19,
        email: 'emailExample@gmail.com',
        phone: 987654321
    },
    {
        id: 2,
        name: 'Morena',
        last_name: 'Aran',
        age: 20,
        email: 'emailExample@gmail.com',
        phone: 123456789
    },
    {
        id: 3,
        name: 'Sabrina',
        last_name: 'Sust',
        age: 46,
        email: 'emailExample@gmail.com',
        phone: 98712354
    },
    {
        id: 4,
        name: 'Leandro',
        last_name: 'Santos',
        age: 45,
        email: 'emailExample@gmail.com',
        phone: 987456231
    },
    {
        id: 5,
        name: 'Guadalupe',
        last_name: 'Santos',
        age: 16,
        email: 'emailExample@gmail.com',
        phone: 981235647
    }
]

viewsRouter.get('/', (req, res) => {
    let testUser = {
        name: 'Nahuel',
        last_name: 'Santos'
    }

    res.render('index', testUser)
})

//Genera un numero random y presenta ESE user
viewsRouter.get('/presentRandom', (req, res) => {
    let randomNumber = Math.floor(Math.random() * 5)    //Genera entre 0 y 4
    let userToRenderIndex = users[randomNumber] //Esto lo usa por index

    // let randomId = Math.floor(Math.random() * 5) + 1; // Genera un número entre 1 y 5
    // let userToRenderId = users.find(u => u.id === randomId) //Busca ese usuario que tiene el id igual al random

    res.render('presentation', userToRenderIndex)
})

//Muestra todos los usuarios
viewsRouter.get('/presentEach', (req, res) => {
    res.render('presentationEach', {users})
})


//Creamos otro array para complicar el codigo.
let products = [{name: 'Paty',price: 10},{name: 'Agua',price: 30},{name: 'Pan',price: 20},{name: 'Savora',price: 12},{name: 'Ranch',price: 11},]

//Muestra con un ternario
viewsRouter.get('/presentTernario', (req, res)=>{
    let admin = {
        userName: 'Nahuel',
        role: true,
    }

    res.render('presentationTernario', {
        user :admin,
        isAdmin: admin.role,
        products,
        style: 'index.css'
    } )
})

export default viewsRouter;