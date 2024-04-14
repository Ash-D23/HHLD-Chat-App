import express from 'express';
import dotenv from 'dotenv';
import http from "http"
import { Server } from "socket.io";

dotenv.config();
const port = process.env.PORT || 5000; 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });
 
 io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('chat msg', (msg) => {
        console.log('Received msg ' + msg);
        socket.broadcast.emit('chat msg', msg);
    });
 });
 

app.get('/', (req, res) => {
  res.send('Congratulations HHLD Chat App');
});


server.listen(port, (req, res) => {
    console.log(`Server is running at ${port}`);
 })
 