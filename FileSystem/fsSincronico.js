import fs from 'node:fs'

const RUTA = './files/txt1.txt'
const RUTA2 = './files/txt2.txt'


//Fs sincronico
if(fs.existsSync(RUTA)){
    //Modifica el texto dentro del archivo
    fs.appendFileSync(RUTA, "Chau\n")

    //Lee el contenido
    let contenido = fs.readFileSync(RUTA, 'utf-8')
    let contenido2 = fs.readFileSync(RUTA2, 'utf-8')

    console.log(contenido);
    console.log(contenido2);

    //Eliminar, BORRA SOLO DE LA RUTA EXACTA
    fs.unlinkSync(RUTA)
    fs.unlinkSync(RUTA2)
}else{
    //Crea un file en la ruta determinada, y pone lo que le puse como segundo param
    fs.writeFileSync(RUTA, "Hola, Funciona?")
    fs.writeFileSync(RUTA2, "2?")

}