import express from 'express';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from './db/connectToMongoDB.js';
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import { subscribe, publish } from "./redis/msgsPubSub.js";
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000; 

const app = express();
const server = http.createServer(app);

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"]
}));

const userSocketMap = {};

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });
 
 io.on('connection', (socket) => {
    const username = socket.handshake.query.username;

    userSocketMap[username] = socket

    const channelName = `chat_${username}`

    subscribe(channelName, (msg) => {
      socket.emit("chat msg", JSON.parse(msg));
    });
   
    socket.on('chat msg', (msg) => {
      const recieverSocket = userSocketMap[msg.receiver]
      if(recieverSocket){
        recieverSocket.emit('chat msg', msg)
      }else{
        const channelName = `chat_${msg.receiver}`
        publish(channelName, JSON.stringify(msg));     
      }


      addMsgToConversation([msg.sender, msg.receiver],
        {
          text: msg.text,
          sender:msg.sender,
          receiver:msg.receiver
        }
      )
      // socket.broadcast.emit('chat msg', msg)
  });

 });

app.use('/msgs', msgsRouter);
 
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Chat App');
});


server.listen(port, (req, res) => {
    connectToMongoDB()
    console.log(`Server is running at ${port}`);
 })
 