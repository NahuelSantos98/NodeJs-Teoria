import { userController } from "../../controllers/user.controller.js";
import Router from "./class.customRouter.js";

export default class UserCustomRouter extends Router{
    init(){
        this.get('/', ['PUBLIC'], (req, res)=>{
            res.json({status: 'success', message:"Ruta publica"})
        })

        this.post('/register', ['PUBLIC'], userController.registerStrategyLocal)

        this.post('/login', ['PUBLIC'], userController.login)

        this.get('/private', ['USER', 'ADMIN'], userController.validationUserWithInfo)

        this.get('/admin', ['ADMIN'], userController.validationUserWithInfo)
    }
}

export const userCustomRouter = new UserCustomRouter()