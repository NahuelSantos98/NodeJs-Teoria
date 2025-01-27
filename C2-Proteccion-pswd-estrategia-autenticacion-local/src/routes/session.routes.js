import { Router } from "express";
import { login, authEndpoint, authAdminEndpoint } from "../controllers/sessionFiles.controller.js";
import { isAdmin } from "../middlewares/isAdmin.handler.js";
import { validateSession } from "../middlewares/validateSession.handler.js";
import passport from "passport";
import { failLoginEndpoint, failRegisterEndpoint, loginEndpoint, logout, registerEndpoint } from "../controllers/sessionClase3.controller.js";

const sessionRouter = Router();

sessionRouter.post('/login-clase-2', login); //Para las sesiones clase 2

sessionRouter.get('/secret-endpoint', validateSession, authEndpoint); //Se agrega el middleware para validar la sesión

sessionRouter.get('/admin-endpoint', validateSession, isAdmin, authAdminEndpoint);

//Clase 3
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), registerEndpoint);

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), loginEndpoint);

sessionRouter.post('/logout', logout);

sessionRouter.get('/failregister', failRegisterEndpoint);
sessionRouter.get('/faillogin', failLoginEndpoint);

export default sessionRouter;