import passport from 'passport'; // Importamos Passport para manejar la autenticación

// Middleware que encapsula la autenticación con Passport
export const passportCall = (strategy) => {
    return async (req, res, next) => { 
        // Ejecutamos passport.authenticate con la estrategia que se pasa como argumento
        passport.authenticate(strategy, (err, user, info) => { 
            if (err) return next(err); // Si hay un error, lo pasamos al middleware de manejo de errores

            if (!user) { 
                // Si no hay un usuario autenticado, respondemos con un error 401 (Unauthorized)
                return res.status(401).json({
                    error: info?.messages ? info.messages : info.toString() // Devolvemos el mensaje de error que proporciona Passport
                });
            }

            req.user = user; // Si el usuario fue autenticado correctamente, lo asignamos al objeto `req`
            next(); // Llamamos a `next()` para que continúe con la siguiente función en la ruta
        })(req, res, next); // Llamamos a la función `authenticate` pasando `req`, `res` y `next`
    };
};
