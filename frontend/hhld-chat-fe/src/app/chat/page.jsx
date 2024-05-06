'use client'
import React, {useState, useEffect, useRef} from 'react';
import io from "socket.io-client";
import axios from "axios";
import { useAuthStore } from '../zustand/useAuthStore';
import { useUsersStore } from '../zustand/useUsersStore';
import ChatUsers from '../_components/ChatUsers';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useChatSelection } from '../zustand/useChatSelection';
import StartConversation from '../_components/StartConversation';
import AddGroupModal from '../_components/AddGroupModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGroups } from '../zustand/useGroups';

const Chat = () => {

    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { authName } = useAuthStore();
    const { updateUsers, UpdateUserStatus } = useUsersStore();
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsg, updateChatMsgswithReciever } = useChatMsgsStore();
    const { chatSelection } = useChatSelection();
    const {groups} = useGroups()

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }

    const getUserData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/users`,
        {
            withCredentials: true
        })

        updateUsers(res.data);
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatMsgs])

    useEffect(() => {
        getUserData();
    }, [])

    useEffect(() => {
        // Establish WebSocket connection
        if(authName){
            const newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}:8080`, {
                query: {
                    username: authName
                }
            });
            setSocket(newSocket);
            // Listen for incoming msgs
            newSocket.on('chat msg', (msg) => {
                updateChatMsgswithReciever(msg)
            })

            newSocket.on('group msg', (msg) => {
                updateChatMsgswithReciever(msg)
            })

            newSocket.on("user status", (data) => {
                // update the user's 
                UpdateUserStatus(data)
            })

            // Clean up function
            return () => newSocket.close();
        }
    },[authName]);

    const sendMsg = (e) => {
        e.preventDefault();

        if(chatSelection === 'Chat'){
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
        }else{
            
            const groupDetails = groups.find(group => group.groupName === chatReceiver)
            const msgToBeSent = {
                text: msg,
                sender: authName,
                groupName: chatReceiver,
                members: groupDetails.members
            };
            if(socket) {
                socket.emit('group msg', msgToBeSent);
                updateChatMsg(msgToBeSent)
                setMsg('');
            }
        }
    }

    return (
        <div className='h-screen flex'>
            <div className='w-1/4'>
                <ChatUsers />
            </div>
            <div className='h-screen w-4/5 flex flex-col'>
                { chatReceiver ? (
                <>
                    <div className='msgs-container h-4/5 overflow-y-scroll p-6 pt-2 pb-0'>
                        {chatMsgs?.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === authName ? "justify-end" : "justify-start"} items-start gap-2.5 p-2`}>
                                <div className="relative w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                </div>
                                <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${msg.sender === authName ? "bg-green-200" : "bg-blue-200"} rounded-e-xl rounded-es-xl`}>
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900">{msg.sender}</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-blacky-400">11:46</span>
                                    </div>
                                    <p className="text-sm font-normal py-2.5 text-gray-900">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='h-1/5 flex items-end justify-center'>
                        <form onSubmit={sendMsg} className='p-6 pt-2 w-full'>
                            <div className="relative">
                                <input 
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    type="search" id="search" className="block w-full p-4 ps-6 text-sm text-gray-900 border-2 border-blue-400 rounded-lg bg-white-50 focus:outline-none focus:border-blue-500 " placeholder="Send Message" required />
                                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">Send</button>
                            </div>
                        </form>
                    </div>
                </>
                ) : (
                    <StartConversation selection={chatSelection} setShowModal={() => setShowModal(true)}/>
                ) }
            </div>
            { showModal ? (
                <AddGroupModal closeModal={()=> setShowModal(false)}/>
            ) : null }
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" 
            />
        </div>
    )
}

export default Chat