import { Router } from "express";

const cookieRouter = Router()

cookieRouter.get('/setCookie', (req, res) => { //Se crea un endpoint para setear la cookie
    res.cookie('coderCookie', 'Cookie prueba').send('Cookie seteada')
    //.cookie() es un método que permite setear una cookie en la respuesta
    //Recibe el name de la cookie y el valor de la cookie
    //con el .send() se envía la respuesta al cliente
})

cookieRouter.get('/getCookie', (req, res)=>{ //Se crea un endpoint para obtener la cookie
    res.send(req.cookies) //Se envía al cliente las cookies que tiene almacenadas
})

cookieRouter.get('/deleteCookie', (req, res)=>{
    res.clearCookie('coderCookie').send('Cookie eliminada') //Se elimina la cookie y se envía la respuesta al cliente
    //Se utiliza el método .clearCookie() para eliminar una cookie
    //Recibe el name de la cookie a eliminar
    //Con el .send() se envía la respuesta al cliente
})


export default cookieRouter