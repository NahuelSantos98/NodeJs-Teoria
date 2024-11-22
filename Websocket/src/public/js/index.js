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

//Esperamos a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    //Para el chat
    const chatBox = document.getElementById('chatBox')
    const messageLogs = document.getElementById('messageLogs')
    let user

    //Verificamos si el chatBox existe en el DOM
    if (chatBox) {
        Swal.fire({
            title: "Inicio de Sesion",
            input: "text",
            text: "Por favor ingrese su nombre de usuario para continuar",
            inputValidator: (valor) => {
                return !valor && 'Ingrese un valor valido'
            },
            allowOutsideClick: false
        }).then(resultado => {
            user = resultado.value
        })

        chatBox.addEventListener('change', (e) => {
            if (chatBox.value.trim().length > 0) {
                socket.emit('mensaje', { usuario: user, mensaje: chatBox.value, hora: new Date().toLocaleString() })
                chatBox.value = ""
            }
        })
    } else {
        console.error('El elemento con id "chatBox" no se encuentra en el DOM');
    }

    socket.on('respuesta', info => {
        messageLogs.innerHTML = ""
        //Recorro los mensajes
        info.forEach(mensaje => {
            messageLogs.innerHTML += `<p>${mensaje.hora}. Usuario ${mensaje.usuario} dice: ${mensaje.mensaje}</p>`
        })
    })
})
