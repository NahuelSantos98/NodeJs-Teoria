import { Router } from "express";

const cookieRouter = Router()

cookieRouter.get('/setCookie', (req, res) => { //Se crea un endpoint para setear la cookie
    res.cookie('coderCookie', 'Cookie prueba', {
        httpOnly: true,  //httpOnly para mayor seguridad
        maxAge: 30000, //definir el tiempo de vida de la cookie, es en milisegundos
    }).send('Cookie seteada') 
    //.cookie() es un método que permite setear una cookie en la respuesta
    //Recibe el name de la cookie y el valor de la cookie
    //con el .send() se envía la respuesta al cliente
})

cookieRouter.get('/getCookie', (req, res)=>{ //Se crea un endpoint para obtener la cookie
    res.send(req.cookies) //Se envía al cliente las cookies que tiene almacenadas
})

cookieRouter.get('/setSignedCookie', (req, res) => {
    res.cookie('nombre', 'nahuel', {
        httpOnly: true,
        maxAge: 30000,
        signed: true //firmar la cookie agrega una capa minima de seguridad adicional. Hace un parecido a encriptarla
        //Lo hace así s%3Anahuel.94IcV7IfpF7v%2BKe%2BPfxKX%2Ff11zD5Rz2L3YgEu8jF6gw
    }).status(200).json({status: 'Ok', message: 'Cookie seteada'})
})

cookieRouter.get('/getSignedCookie', (req, res) => {
    console.log(req.signedCookies);
    res.send(req.signedCookies); //Para obtener la cookie firmada
})


cookieRouter.get('/deleteCookie', (req, res)=>{
    res.clearCookie('coderCookie').send('Cookie eliminada') //Se elimina la cookie y se envía la respuesta al cliente
    //Se utiliza el método .clearCookie() para eliminar una cookie
    //Recibe el name de la cookie a eliminar
    //Con el .send() se envía la respuesta al cliente
})


export default cookieRouter