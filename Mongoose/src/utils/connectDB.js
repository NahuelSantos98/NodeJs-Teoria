import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Verificar que la variable DB_URL esté disponible
console.log('DB_URL:', process.env.DB_URL);  // Esto te ayudará a ver si la variable es leída correctamente

// Obtener la URL de conexión a la base de datos
const uri = process.env.DB_URL;

if (!uri) {
  console.error('DB_URL no está definida en el archivo .env');
  process.exit(1); // Termina el proceso si no se puede encontrar DB_URL
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,     // Usa el nuevo analizador de URL
      useUnifiedTopology: true, // Usa el nuevo motor de topología
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);  // Termina el proceso si no se puede conectar
  }
};

export default connectToDatabase;
