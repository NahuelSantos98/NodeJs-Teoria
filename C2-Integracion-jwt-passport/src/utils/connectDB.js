import { mongoose } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectionDataBase = async () => {
    try {
        await mongoose.connect(process.env.URL_DB);
        console.log("BDD conectada");
    } catch (e) {
        console.log("Error al conectar con bdd: ", e);
        process.exit(1);
    }
};

export default connectionDataBase