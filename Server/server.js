import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "PUT"],
  },
});

// When a user connects
io.on("connection",(socket)=>{
    console.log(socket.id); // ID mil gaya

    // Jab user kisi room mein join karta hai
    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User ID :- ${socket.id} ne room join kiya : ${data}`); // User ID ne room join kiya
    });

    // Jab message bheja jata hai
    socket.on("send_message",(data)=>{
        console.log("Send message data ",data);
        socket.to(data.room).emit("receive_message",data);
    });

    // Jab user disconnect hota hai
    socket.on("disconnect",()=>{
        console.log("User Disconnected..",socket.id); // User Disconnect ho gaya
    });
});

// Middleware for CORS
app.use(cors());

// Server listening on port 1000
server.listen(1000,()=>console.log("Server is running on port 1000")); // Server chal raha hai port 1000 par
