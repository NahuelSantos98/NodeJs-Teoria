import { mongoose } from "mongoose";

const connectionDataBase = async () => {
    try {
        await mongoose.connect('mongodb+srv://santosnahuel98:HUcnjq5jptabw8lj@practica-coder.ai2ti.mongodb.net/?retryWrites=true&w=majority&appName=Practica-Coder');
        console.log("BDD conectada");
    } catch (e) {
        console.log("Error al conectar con bdd: ", e);
        process.exit(1);
    }
};

export default connectionDataBase