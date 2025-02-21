import MongoDao from './mongo.dao.js';
import userModel from '../models/user.model.js';
import dotenv from 'dotenv'

dotenv.config()

class UserDao extends MongoDao {
    constructor() {
        super(userModel);
    }

    async getByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            console.error('Error en getByEmail:', error);
            throw new Error("Error while obtaining the user");
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new Error("Error while obtaining the user")
        }
    }


}

export const userDao = new UserDao();
