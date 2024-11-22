import { Router } from "express";

const viewsRouter = Router()

viewsRouter.get('/', (req, res)=>{
    res.render('templates/home')
})

const productos = [
    { nombre: "Chocolate", marca: "Chocolatin", precio: 2450, stock: 12, status: true },
    { nombre: "Hamburguesa", marca: "Hamburguesin", precio: 2230, stock: 22, status: true },
    { nombre: "Arroz", marca: "Arrocin", precio: 1330, stock: 42, status: false }
]

viewsRouter.get('/products', (req, res)=>{
    res.render('templates/productos', {productos})
})

viewsRouter.get('/chat', (req, res)=>{
    res.render('templates/chat')
})

export default viewsRouter;