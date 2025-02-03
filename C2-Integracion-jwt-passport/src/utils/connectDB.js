import { mongoose } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectionDataBase = async () => {
    try {
        // Conexión con parámetros adicionales para asegurar la correcta conexión
        await mongoose.connect(process.env.URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Tiempo límite para la selección de servidores
        });
        console.log("BDD conectada");
    } catch (e) {
        console.log("Error al conectar con bdd: ", e);
        process.exit(1); // Si la conexión falla, el proceso se termina
    }
};

export default connectionDataBase;
