import { Router } from 'express';

const sessionRouter = Router();

// sessionRouter.get('/', (req, res) => { //Se crea una ruta para la sesión
//     if (req.session.count) { //Si existe la sesión (Osea refresca la pagina o vuelve a entrar)
//         req.session.count++ //Se incrementa el contador
//         res.send(`Session count: ${req.session.count}`) //Devuelve las veces que se ha visitado la página
//     } else {
//         req.session.count = 1 //Si no existe la sesión, se crea y se inicializa en 1
//         res.send(`Bienvenido a la sesión`) //Le da la bienvenida
//     }
// });


sessionRouter.get('/logout', (req, res) => { //Se crea una ruta para cerrar la sesión
    req.session.destroy(err => {
        //se destruye la sesión, se tiene que limpiar la cookie connect.sid y si es que hay un error, se envía un mensaje de error
        if (!err) {
            res.clearCookie("connect.sid") //Se limpia la cookie
            res.send("Sesión cerrada") //Se envía un mensaje de que la sesión ha sido cerrada
        } else {
            res.send({ stautus: "Error", data: err }) //Si hay un error, se envía un mensaje de error
        }
    })
})

//Function de login
sessionRouter.get('/login', (req, res) => {
    const { user, password } = req.query; //Se obtienen los datos del body

    if (!user || !password) { //Si no se envían los datos, se envía un mensaje de error
        res.send('Usuario o contraseña son requeridos')
    }

    if (user !== 'coder' || password !== 'house') {   //Comprueba si el usuario y la contraseña son correctos
        res.send('Usuario o contraseña incorrecta') //Si no son correctos, se envía un mensaje de error
    }
        req.session.user = user;    //Si son correctos, se crea la sesión y se le asigna el nombre de usuario
        req.session.admin = true;   //Se le asigna un rol de administrador
        res.send('Ok')  //Se envía un mensaje de que todo ha ido bien

})

//Middleware de autenticación
function auth(req, res, next) { //Se define la function auth

    if (req.session?.user === 'coder' && req.session?.admin) { //Si el usuario es coder y es admin
        return next() //Se pasa al siguiente middleware
    }
    res.status(401).send('No autorizado') //Si no es admin, se envía un mensaje de error
}

//Ruta protegida
sessionRouter.get('/protected', auth, (req, res) => { //Se utiliza el middleware auth para proteger la ruta
    res.send('Ruta protegida') //Si se ha pasado el middleware, se envía un mensaje de que la ruta está protegida
})

export default sessionRouter;