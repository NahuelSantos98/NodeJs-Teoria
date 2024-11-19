import { log } from "console"

const socket = io()
//En este archivo index.js es donde tendremos el socket/cliente para conectar con socket/servidor

//Para mandar mensaje desde cliente a servidor o viceversa, se usa .emit(), 
//este tiene que tener el id del evento (En este caso “message”), seguido del contenido.
socket.emit('message', 'Este es el mensaje para el servidor desde el cliente.' )


//Para escuchar al servidor desde el cliente:
socket.on('evento_para_socket_individual', data=>{
    console.log(data);
})

socket.on('evento_para_todos_menos_el_socket_actual', data=>{
    console.log(data);
})

socket.on('evento_para_todos', data=>{
    console.log(data);
})