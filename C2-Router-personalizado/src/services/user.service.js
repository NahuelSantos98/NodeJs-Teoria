import { cartController } from '../controllers/cart.controller.js';
import { userDao } from '../dao/user.dao.js';
import { createHash, isValidPassword } from '../utils/configPassword.js';
import jwt from 'jsonwebtoken';

class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    async getByEmail(email) {
        try {
            let response = await this.dao.getByEmail(email);
            if (!response) throw new Error("User not found");
            return response
        } catch (error) {
            console.log('Error getByEmail service');
            throw new Error(error.message);
        }
    }

    async getById(id) {
        try {
            let response = await this.dao.getById(id)
            if (!response) throw new Error("User not found");
            return response
        } catch (error) {
            console.log('Error getById service');
            throw new Error(error.message);
        }
    }

    async generateToken(user) {
        const payload = { //Setea campos que se van a guardar.
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role,
        };
        return jwt.sign(payload, process.env.COOKIE_KEY, { expiresIn: "30m" });
    }

    async registerStrategyLocal({ first_name, last_name, email, age, password, role }) {
        try {
            let userExists = await this.dao.getByEmail(email);
            if (userExists) throw new Error('Email already in use.');

            let cartForUser = await cartController.createCartForRegister()

            if (!cartForUser) {
                throw new Error('Cart can not be created for this user.')
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: role ? role.toUpperCase() : "USER",
                cart: cartForUser._id
            };

            return await this.dao.create(newUser);
        } catch (error) {
            console.error('Error in register user service:', error);
            throw new Error(error.message);
        }
    }


    async login (user){
        try {
            const { email, password } = user;

            const userExist = await this.getByEmail(email);            
            if (!userExist) throw new Error("User not found");

            const isPswValid = isValidPassword(password, userExist);
            if (!isPswValid) throw new Error("Invalid fields");
            return this.generateToken(userExist);
        } catch (error) {
            throw error;
        }
    };

}

export const userService = new UserService(userDao);
