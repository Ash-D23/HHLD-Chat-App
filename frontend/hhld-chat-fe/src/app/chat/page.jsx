'use client'
import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import axios from "axios";
import { useAuthStore } from '../zustand/useAuthStore';
import { useUsersStore } from '../zustand/useUsersStore';
import ChatUsers from '../_components/ChatUsers';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';

const Chat = () => {

    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    // const [msgs, setMsgs] = useState([]);
    const { authName } = useAuthStore()
    const { updateUsers } = useUsersStore()
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsg, updateChatMsgswithReciever } = useChatMsgsStore();

    const getUserData = async () => {
        const res = await axios.get('http://localhost:5000/users',
                {
                    withCredentials: true
                })
        updateUsers(res.data);
    }

    useEffect(() => {
        getUserData();
    }, [])

    useEffect(() => {
        // Establish WebSocket connection
        if(authName){
            const newSocket = io('http://localhost:8080', {
                query: {
                    username: authName
                }
            });
            setSocket(newSocket);
            // Listen for incoming msgs
            newSocket.on('chat msg', (msg) => {
                updateChatMsgswithReciever(msg)
                
            })
            // Clean up function
            return () => newSocket.close();
        }
    },[authName]);

    const sendMsg = (e) => {
        e.preventDefault();
        const msgToBeSent = {
            text: msg,
            sender: authName,
            receiver: chatReceiver
        };

        if(socket) {
            socket.emit('chat msg', msgToBeSent);
            updateChatMsg(msgToBeSent)
            setMsg('');
        }
    }

    return (
        <div className='h-screen flex divide-x-4'>
            <div className='w-1/4 overflow-y-scroll'>
                <ChatUsers />
            </div>
            <div className='h-screen w-4/5 flex flex-col'>
                <div>
                    <h2>{authName} is chatting with {chatReceiver}</h2>
                </div>
                <div className='msgs-container h-4/5 overflow-y-scroll p-6 pt-2 pb-0'>
                    {chatMsgs?.map((msg, index) => (
                        <div key={index} className={ `m-3 p-1 ${msg.sender === authName ? "text-right" : "text-left"}` }>
                            <span className={`p-2 rounded-md ${msg.sender === authName ? 'bg-blue-200' : 'bg-green-200'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className='h-1/5 flex items-center justify-center'>
                    <form onSubmit={sendMsg} className='p-6 pt-2 w-full'>
                        <div className="relative">
                            <input 
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                type="search" id="search" className="block w-full p-4 ps-6 text-sm text-gray-900 border border-blue-300 rounded-lg bg-white-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Send Message" required />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat