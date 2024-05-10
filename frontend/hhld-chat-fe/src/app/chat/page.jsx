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
import { useRouter } from 'next/navigation';
import ChatMessage from '../_components/ChatMessage';

const Chat = () => {

    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { authName } = useAuthStore();
    const { updateUsers, UpdateUserStatus } = useUsersStore();
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsg, updateChatMsgswithReciever } = useChatMsgsStore();
    const { chatSelection } = useChatSelection();
    const {groups, addGroups, updateGroups} = useGroups()
    const router = useRouter();

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

    const getUserGroups = async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/groups`,
        {
            username: authName
        })

        return res.data
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatMsgs])

    useEffect(() => {
        getUserData();
    }, [])

    const subscribeToUserGroups = async (socket) => {
        const groups = await getUserGroups()
        if(groups.length !== 0){
            socket.emit('grp subscribe', { groups });
        }
        updateGroups(groups)
    }

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

            newSocket.on("add group", (group) => {
                addGroups(group)
                toast.success(`${group.Owner} added you to ${group.groupName}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
            })

            subscribeToUserGroups(newSocket)

            // Clean up function
            return () => newSocket.close();
        }else{
            router.push('/')
        }
    },[authName]);

    const sendMsg = (e) => {
        e.preventDefault();

        if(chatSelection === 'Chat'){
            const msgToBeSent = {
                text: msg,
                sender: authName,
                receiver: chatReceiver,
                createdAt: new Date()
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
                members: groupDetails.members,
                createdAt: new Date()
            };
            if(socket) {
                socket.emit('group msg', msgToBeSent);
                updateChatMsg(msgToBeSent)
                setMsg('');
            }
        }
    }

    const sendAddGroupNotification = (groupName, Owner, members) => {
        if(socket) {
            socket.emit('add group', {groupName, Owner, members});
        }
    }


    return (
        <div className='h-screen flex box-border'>
            <div className='w-1/4 min-w-96'>
                <ChatUsers />
            </div>
            <div className='h-screen w-4/5 flex flex-col'>
                { chatReceiver ? (
                <>
                    <div className='msgs-container h-4/5 overflow-y-scroll p-6 pt-2 pb-0'>
                        {chatMsgs?.map((msg, index) => (
                            
                            <ChatMessage key={index} msg={msg} />
                            
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
                <AddGroupModal closeModal={()=> setShowModal(false)} sendAddGroupNotification={sendAddGroupNotification} />
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