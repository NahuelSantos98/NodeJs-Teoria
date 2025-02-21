import { userService } from "../services/user.service.js";

class UserController {
    constructor(service) {
        this.service = service;
        this.registerStrategyLocal = this.registerStrategyLocal.bind(this);
        this.login = this.login.bind(this)
    }

    async registerStrategyLocal(req, res, next) {
        try {
            const user = await this.service.registerStrategyLocal(req.body, next);
            res.status(201).json({ status: 'success', payload: user });
        } catch (error) {
            console.error('Error en UserController:', error);
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const token = await this.service.login(req.body);
            res.cookie('jwt', token, { httpOnly: true }).json({ message: 'Logged in', token });
            //HttpOnly para mas seguridad de la cookie
        } catch (error) {
            next(error);
        }
    };

    async validationUserWithInfo(req, res, next) {
        try {
            if (!req.user)
                throw new Error("Can not access to user info");
            res.json({
                user: req.user,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController(userService);
