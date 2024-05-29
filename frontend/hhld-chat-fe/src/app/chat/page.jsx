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
    const { chatMsgs, updateChatMsg, updateChatMsgswithReciever, addNewGroupConversation, updateChatConversationOnSend, updateGroupConversationOnSend} = useChatMsgsStore();
    const { chatSelection } = useChatSelection();
    const {groups, addGroups, updateGroups} = useGroups()
    const [isLoading, setIsLoading] = useState(true)
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
                addNewGroupConversation(group)
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
            setIsLoading(false)
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
                updateChatConversationOnSend(msgToBeSent)
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
                updateGroupConversationOnSend(msgToBeSent)
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
            { isLoading ? (
            <div className="bg-gray-50 h-screen w-screen absolute flex justify-center items-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : null}
        </div>
    )
}

export default Chat