import express from 'express';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from './db/connectToMongoDB.js';
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from "./routes/msgs.route.js";
import { subscribe, publish } from "./redis/msgsPubSub.js";
import cors from 'cors';
import { updateUserStatus } from './api/User-requests.js';
import groupsRouter from './routes/groups.route.js'

dotenv.config();
const port = process.env.PORT || 5000; 

const app = express();
const server = http.createServer(app);

app.use(cors({
  credentials: true,
  origin: "*"
}));

app.use(express.json());

const userSocketMap = {};

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });
 
 io.on('connection', (socket) => {
    const username = socket.handshake.query.username;

    console.log('connected - ' + username);
    // Note - Improvement have a topic - user_status_friendName and who all have this friend name will recieve that friend's status when online
    // In our app we don't have a friend's list all users are available in Chat list to chat with hence the below solution
    subscribe("user_status", (data) => {
      const jsonData = JSON.parse(data)
      if(jsonData.username !== username){
        socket.emit('user status', jsonData)
      }
      
    });

    const subscribeUserToGrp = (group) => {
      subscribe(`group_${username}_${group.groupName}`, (data) => {
        const jsonData = JSON.parse(data)

          socket.emit('group msg', {
            text: jsonData.text,
            sender: jsonData.sender,
            groupName: jsonData.groupName
          })
        
      })
    }

    //Pub Sub group_recieverName_groupName
    socket.on('grp subscribe', (data) => {
      for(let group of data.groups){
        subscribeUserToGrp(group)
      }
    })

    // Update user status in db
    updateUserStatus(username, new Date(), true)
    // broadcast all that this user is online 
  
    userSocketMap[username] = socket

    const channelName = `chat_${username}`

    subscribe(channelName, (msg) => {
      socket.emit("chat msg", JSON.parse(msg));
    });

    subscribe(`add_group_${username}`, (data) => {
      const jsonData = JSON.parse(data)
      socket.emit('add group', jsonData);

      subscribeUserToGrp(jsonData)

    })

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
          receiver:msg.receiver,
          createdAt: msg.createdAt
        }
      )
      // socket.broadcast.emit('chat msg', msg)
    });

    socket.on('group msg', (msg) => {
      // Find members from groupName
      const members = msg.members

      // Add to Conversations DB

      addMsgToConversation(members,
        {
          text: msg.text,
          sender: msg.sender,
          createdAt: msg.createdAt
        },
        true, msg.groupName
      )

      // Remove sender from receiver

      const receivers = members.filter(receiver => receiver !== msg.sender)

      // Send to all recievers the message

      for(let receiver of receivers){
        const recieverSocket = userSocketMap[receiver]
        if(recieverSocket){
          recieverSocket.emit('group msg', {
            text: msg.text,
            sender: msg.sender,
            groupName: msg.groupName,
            createdAt: msg.createdAt
          })
        }else{
          //Pub Sub group_recieverName_groupName
          publish(`group_${receiver}_${msg.groupName}`, JSON.stringify({
            text: msg.text,
            sender: msg.sender,
            groupName: msg.groupName,
            createdAt: msg.createdAt
          }))
        }
      }
    })

    socket.on('add group', (group) => {
      // Find members from groupName
      const members = group.members

      // Remove sender from receiver
      const receivers = members?.filter(receiver => receiver !== group.Owner)

      for(let receiver of receivers){
        const recieverSocket = userSocketMap[receiver]
        if(recieverSocket){
          recieverSocket.emit('add group', group)
        }else{
          //Pub Sub group_recieverName_groupName
          publish(`add_group_${receiver}`, JSON.stringify(group))
        }
      }

      subscribeUserToGrp(group)

    })

    socket.on('disconnect', () => {

      console.log('disconnected - ' + username);

      // update user status in DB
      updateUserStatus(username, new Date(), false)
      
    });

 });

app.use('/msgs', msgsRouter);

app.use('/groups', groupsRouter);
 
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Chat App');
});


server.listen(port, (req, res) => {
    connectToMongoDB()
    console.log(`Server is running at ${port}`);
 })
 