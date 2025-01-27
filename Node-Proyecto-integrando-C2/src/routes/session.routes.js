import { Router } from "express";
import { login, authEndpoint, authAdminEndpoint } from "../controllers/sessionFiles.controller.js";
import { isAdmin } from "../middlewares/isAdmin.handler.js";
import { validateSession } from "../middlewares/validateSession.handler.js";


const sessionRouter = Router();

sessionRouter.post('/login', login)

sessionRouter.get('/secret-endpoint', validateSession, authEndpoint ) //Se agrega el middleware para validar la sesión

sessionRouter.get('/admin-endpoint',validateSession, isAdmin, authAdminEndpoint)

export default sessionRouter;