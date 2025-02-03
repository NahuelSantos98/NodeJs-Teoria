import { Router } from "express";
import { getUserAuthorized, jwtLogin, register } from "../controllers/jwtImplement.controller.js";
import { passportCall } from "../middlewares/passportCall.js";


const jwtRouter = Router()

jwtRouter.post('/register', passportCall('register'), register)

jwtRouter.post('/login', jwtLogin)

jwtRouter.get('/current', passportCall('jwt'),getUserAuthorized)

export default jwtRouter