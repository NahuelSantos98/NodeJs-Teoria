import userModel from "../models/user.model.js";
import {isValidPassword} from '../utils/configPassword.js'
import dotenv from 'dotenv'

dotenv.config()

export const register = (req, res)=>{
    res.send({ status: 'success', message: 'User registered' });
}

export const jwtLogin = async(req, res)=>{
    const {email, password} = req.body;
    
    try {
        const user = await userModel.findOne({email: email})

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const isPasswordValid = isValidPassword(user, password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign( //Se firma el token
            { email: user.email, password: user.password, role: user.role }, //Con estos datos se va a firmar
            process.env.JWT_SECRET, //Token Key
            { expiresIn: "1h" } //Expiration del token
        );

        return res.json({message: "Login Exitoso", token})

    } catch (e) {
        console.error("Error en login:", e);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


export const getUserAuthorized = (req, res) => res.send(req.user) 