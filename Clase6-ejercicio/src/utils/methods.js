import {promises as fs } from 'node:fs'


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
        throw new Error('No se pudo guardar el producto.')
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

export const putProduct = async (data, ruta) => {
    try {
        // Leer el archivo y parsearlo a JSON
        const arrayProducts = await fs.readFile(ruta, 'utf-8');
        let arrayFind = JSON.parse(arrayProducts);

        // Encontrar el producto a modificar
        const productToModify = arrayFind.find(p => p.id === data.id);

        if (!productToModify) {
            throw new Error(`No se encontró el producto con id: ${data.id}`);
        }

        // Modificar las propiedades del producto
        productToModify.title = data.title || productToModify.title;
        productToModify.description = data.description || productToModify.description;
        productToModify.price = data.price || productToModify.price;
        productToModify.thumbnail = data.thumbnail || productToModify.thumbnail;
        productToModify.code = data.code || productToModify.code;
        productToModify.stock = data.stock || productToModify.stock;

        // Guardar el array modificado en el archivo
        await fs.writeFile(ruta, JSON.stringify(arrayFind, null, 2), 'utf-8');

        return productToModify; // Retornar el producto modificado
    } catch (error) {
        console.error(error);
        throw new Error("No se pudo modificar el producto");
    }
};

export const deleteProduct = async(id, ruta)=>{
    try {
        const arrayProducts = await fs.readFile(ruta, 'utf-8')  //Agarra el contenido del archivo
        let filterArray = JSON.parse(arrayProducts) //Lo parsea a aun array
        let modifiedArray = filterArray.filter(p => p.id !== id)    
        //Filtra el array con los productos diferentes al id otorgado

        if (filterArray.length === modifiedArray.length) {
            throw new Error(`No se encontró el producto con id: ${id}`);
        }

        await fs.writeFile(ruta, JSON.stringify(modifiedArray, null, 2), 'utf-8')
        //Si lo encuentra, escribe los products SIN el eliminado

    } catch (error) {
        console.error(error);
        throw new Error("No se pudo borrar el producto")
    }
}