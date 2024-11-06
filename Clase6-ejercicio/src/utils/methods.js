import {promises as fs } from 'node:fs'
const RUTA = './files/products.json' 


export const addProduct = async (prod) => {
    try {
        let productos = [];

        // Verifica si el archivo existe y si tiene contenido
        try {
            const contenido = await fs.readFile(prod.path, 'utf-8');
            
            if (contenido.trim() !== '') {  // Verifica que el contenido no esté vacío
                productos = JSON.parse(contenido);  // Convierte el contenido en un array de objetos
            }
        } catch (error) {
            console.error(error);
        }

        // Agrega el nuevo producto a la lista
        productos.push(prod);

        // Escribe toda la lista actualizada en el archivo
        await fs.writeFile(prod.path, JSON.stringify(productos, null, 2)); // Usa null y 2 para mejorar la legibilidad

        return prod

    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
};



export const getProducts= async(ruta)=>{
    try {
        let contenido = await fs.readFile(ruta, 'utf-8')
        return JSON.parse(contenido) //Para que devuelva los productos en formato de Objeto.
    } catch (error) {
        console.error(error);
        return []; // Devuelve un array vacío en caso de error
    }
}


export const getProductById = async (id, ruta) => {
    let arrayFind = [];
    try {
        let contenido = await fs.readFile(ruta, 'utf-8');
        arrayFind = JSON.parse(contenido);  // Convierte el contenido en un array de objetos
        let productFind = arrayFind.find(p => p.id == id);

        if (!productFind) {
            throw new Error(`No se encontró el producto con id: ${id}`); 
            // Lanzar el error para que pueda ser capturado por el catch del endpoint
        }
        return productFind;
    } catch (e) {
        console.error(e);
        throw e;  // Lanza el error para que sea capturado más adelante
    }
};