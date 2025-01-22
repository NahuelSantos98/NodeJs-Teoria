import {Router} from 'express';

const sessionRouter = Router();

sessionRouter.get('/', (req, res) => { //Se crea una ruta para la sesión
    if(req.session.count){ //Si existe la sesión (Osea refresca la pagina o vuelve a entrar)
        req.session.count++ //Se incrementa el contador
        res.send(`Session count: ${req.session.count}`) //Devuelve las veces que se ha visitado la página
    }else{
        req.session.count = 1 //Si no existe la sesión, se crea y se inicializa en 1
        res.send(`Bienvenido a la sesión`) //Le da la bienvenida
    }
});


sessionRouter.get('/logout', (req, res) => { //Se crea una ruta para cerrar la sesión
    req.session.destroy(err => { 
        //se destruye la sesión, se tiene que limpiar la cookie connect.sid y si es que hay un error, se envía un mensaje de error
        if(!err){
            res.clearCookie("connect.sid") //Se limpia la cookie
            res.send("Sesión cerrada") //Se envía un mensaje de que la sesión ha sido cerrada
        }else{
            res.send({stautus: "Error", data: err}) //Si hay un error, se envía un mensaje de error
        }
    })
})


export default sessionRouter;