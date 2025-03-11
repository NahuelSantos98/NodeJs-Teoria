import { Router as CustomRouter } from 'express'
import jwt from 'jsonwebtoken'
import env from '../../utils/envVariables.js'

export default class Router {
    constructor() {
        this.router = CustomRouter(); //Remplaza a tener que instanciarlo (const customRouter = new Router())
        this.init()
    }

    getRouter() { //Se va a usar para inicializar en el app con el app.use
        return this.router;
    }

    //En el enrutador de tipo get se reciben:
    //.get('/path', [array de midd], callback )
    //Al no saber cuantos middlewares puede tener, se va a usar el spread operator ...

    get(path, roles, ...cb) { //Recibe paths, roles (array de midd), cb (Funcion a realizar con req y res.)
        this.router.get(path, this.managerRoles(roles), this.resolveCallbacks(cb)) //Los managers son los que se encargan de ejecutar cada midd o cb que se realice.
    }

    post(path, roles, ...cb) {
        this.router.post(path, this.managerRoles(roles), this.resolveCallbacks(cb))
    }

    put(path, roles, ...cb) {
        this.router.put(path, this.managerRoles(roles), this.resolveCallbacks(cb))
    }

    delete(path, roles, ...cb) {
        this.router.delete(path, this.managerRoles(roles), this.resolveCallbacks(cb))
    }

    resolveCallbacks(callbacks) {//Recibe un array
        return callbacks.map((cb) => async (...params) => {
            //Los mapea y va a resolver lo siguiente por cada function y los param los toma con un ...
            try {
                await cb.apply(this, params)
                //.apply es de js que hace que se ejecuten lo que se le pasa
                //this apunta a la instancia/function
                //params son los params de esa misma function que se va a ejecutar
            } catch (e) {
                throw new Error(e)
            }
        });
    }

    managerRoles(roles) {
        return (req, res, next) => {
            try {    
                if (roles.includes("PUBLIC")) return next(); // Si es pública, pasa directamente.
    
                let token;
    
                // 1. Intentar obtener el token desde cookies
                if (req.cookies && req.cookies.jwt) {
                    token = req.cookies.jwt;
                    console.log("Token en cookies:", token);
                    
                }
                // 2. Si no está en cookies, intentar obtenerlo del header Authorization (Bearer Token)
                else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
                    token = req.headers.authorization.split(" ")[1]; // Extraer token después de "Bearer"
                    console.log("Token en headers:", token);
                }
    
                if (!token) {
                    return res.status(401).json({ message: "Unauthorized: No token provided" });
                }
    
                // 3. Verificar y decodificar el token
                const user = jwt.verify(token, env.keyCookie); // Verificar el token con la clave secreta
                console.log("Usuario autenticado:", user);
    
                // 4. Verificar si el usuario tiene al menos uno de los roles requeridos
                const userRole = user.role.toUpperCase(); // Asegurar mayúsculas
                console.log("Rol del usuario:", userRole);
    
                if (!roles.includes(userRole)) {
                    return res.status(403).json({ status: "error", message: "Unauthorized: Insufficient role" });
                }
    
                req.user = user; // Guardar la info del usuario en req.user
    
                next(); // Pasar al siguiente middleware
            } catch (error) {
                console.error("Error en autenticación:", error);
                res.status(401).json({ message: "Invalid token" });
            }
        };
    }
    
}
