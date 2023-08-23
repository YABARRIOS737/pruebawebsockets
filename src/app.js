import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import {Server} from "socket.io";

const app = express();
const puerto = 8080;
const httpServer = app.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", viewsRouter);

const messages = []; //Array de mensajes

socketServer.on("connection", (socket) => {
    console.log("nueva Conexion!");
    socket.broadcast.emit("nuevaConexion", "Hay un nuevo usuario conectado!");

    socket.on("nuevoUsuario", (data) => {
        socket.broadcast.emit("nuevoUsuario", data + "Se ha conectado!");
    });

    socket.on("message", (data) => {
        messages.push({usuario:data.usuario,foto:data.foto, mensaje:data.mensaje});
        socket.emit("messages", messages); 
    });
});