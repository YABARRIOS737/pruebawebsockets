const socket = io();
const chatBox = document.getElementById("chatBox");
const messageLogs = document.getElementById("messageLogs");
let usuario = "";
let foto = "";

Swal.fire({
    title: "Bienvenida",
    text: "Ingrese su nombre",
    input: "text",
    inputValidator: (value) => {
        return !value && "Error! No se ingresó un nombre!";
    }
}).then(data => {
    usuario = data.value;
    socket.emit("nuevoUsuario", usuario);

    Swal.fire({
        title: "Ingrese su Foto",
        text: "Ingrese su foto",
        input: "text",
        inputValidator: (value) => {
            return !value && "Error! No se ingresó la Foto!";
        }
    }).then(data => {
        foto = data.value;
    });
});

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { usuario: usuario, foto: foto, mensaje: chatBox.value.trim() });
            chatBox.value = "";
        }
    }
});

socket.on("nuevaConexion", data => {
    Swal.fire({
        position: 'top-end',
        title: data,
        showConfirmButton: false,
        timer: 1500
    })
});

socket.on("nuevoUsuario", data => {
    Swal.fire({
        position: 'top-end',
        title: data,
        showConfirmButton: false,
        timer: 1500
    })
});

socket.on("messages", (data) => {
    let salida = ``;
    data.forEach(item => {
        salida += `<div class="row mb-3">
        <div class="col-md-1"><img src="${item.foto}" alt="Foto" width="48" height="48" class="rounded-circle"></div>
        <div class="col-md-11"><b>${item.usuario}:</b><br><span class="fw-light">${item.mensaje}</span></div>
        </div>`;
    });

    messageLogs.innerHTML = salida;
});