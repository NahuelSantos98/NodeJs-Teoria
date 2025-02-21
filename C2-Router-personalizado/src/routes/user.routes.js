import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import passport from 'passport';
import { passportCall } from '../middlewares/passportCall.middleware.js';

const userRouter = Router();

userRouter.post('/register', userController.registerStrategyLocal);

userRouter.post('/login', userController.login);

userRouter.get('/current', passportCall('jwt') ,userController.validationUserWithInfo)

userRouter.get("/private-headers", passportCall('jwt'), userController.validationUserWithInfo);

userRouter.get("/private-cookies", (req, res, next) => {
    console.log("Cookies recibidas:", req.cookies); // Verifica qué cookies llegan
    next();
}, passportCall("jwtCookies"), userController.validationUserWithInfo);



// Ruta para verificar quién está logueado
userRouter.get('/verifyWho', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        // Si el token es válido, se accederá a los datos del usuario desde `req.user`
        const { first_name, last_name, email, password, cart, age,role } = req.user; // Aquí puedes acceder solo a los campos que te interesen
        res.status(200).json({
            message: "User is logged in",
            user: { first_name, last_name, email, password, cart, age, role } // Solo devuelves los campos que necesitas
        });
    } else {
        res.status(401).json({
            message: "User is not logged in"
        });
    }
});

userRouter.get('*', (req, res)=>{
    res.status(404).json({status: 'error', message: 'No request for this endpoint for User'})
})


export default userRouter;
