import { promises as fs } from 'node:fs';
import crypto from 'crypto';

const RUTA = './jsonProducts/products.json';

class Producto {
    constructor(nombre, marca, precio, stock) {
        this.id = crypto.randomBytes(10).toString('hex');
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.stock = stock;
    }
}

const prod1 = new Producto("Arroz", "Arrocin", 120, 40);
const prod2 = new Producto("Leche", "Lechin", 130, 30);
const prod3 = new Producto("Pan", "Pancin", 150, 10);
const prod4 = new Producto("Agua", "Aguin", 170, 20);

const inicializarArchivo = async (ruta) => {
    try {
        await fs.access(ruta); // Verifica si el archivo existe
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Si el archivo no existe, lo crea con un array vacío
            await fs.writeFile(ruta, '[]');
            console.log(`Archivo ${ruta} creado e inicializado.`);
        } else {
            throw error;
        }
    }
};

const guardarProd = async (prod, ruta) => {
    try {
        let productos = [];

        const contenido = await fs.readFile(ruta, 'utf-8');
        productos = JSON.parse(contenido);  // Convierte el contenido a un array de objetos

        // Agrega el nuevo producto a la lista
        productos.push(prod);

        // Escribe toda la lista actualizada en el archivo
        await fs.writeFile(ruta, JSON.stringify(productos, null, 2));

        console.log(`Producto guardado: ${JSON.stringify(prod)}`);
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
};

// Función para inicializar el archivo y guardar los productos
const guardarProductos = async () => {
    await inicializarArchivo(RUTA);
    await guardarProd(prod1, RUTA);
    await guardarProd(prod2, RUTA);
    await guardarProd(prod3, RUTA);
    await guardarProd(prod4, RUTA);
};

guardarProductos();
