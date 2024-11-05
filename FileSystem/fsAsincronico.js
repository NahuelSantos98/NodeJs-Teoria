import { promises as fs } from 'node:fs'

const RUTA = './files/txt1.txt'


const creacionArchivos = async (ruta) => {
    await fs.writeFile(ruta, "")

    await fs.appendFile(ruta, "Hola Buenos dias!")
    let contenido = await fs.readFile(ruta, "utf-8")

    console.log(contenido);

    await fs.unlink(ruta)

}

creacionArchivos(RUTA)