import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { authName } = useAuthStore()
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs} = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  }

  useEffect(() => {
    const getMsgs = async () => {
        const res = await axios.get('http://localhost:8080/msgs',
            {
                params: {
                    'sender': authName,
                    'receiver': chatReceiver
                }
            },
            {
                withCredentials: true
            });

        if (res.data.length !== 0) {
            updateChatMsgs(res.data);
        } else {
            updateChatMsgs([]);
        }
    }
    if(chatReceiver) {
        getMsgs();
    }
  }, [chatReceiver])
 
  return (
    <div className='bg-white h-screen'>
        <ul className="w-full text-gray-900 ">
        <div className='w-full bg-sky-600 px-4 py-2 text-lg border-b border-gray-200 text-white font-bold text-center'>
            My Chat App
        </div>
        {users.map((user, index) => (
            <div  
             key={index}
             onClick={() => setChatReceiver(user)}
             className={`${chatReceiver === user.username ? 'bg-sky-200' : 'bg-white'} w-full flex px-4 py-2 border-b border-blue-100 text-black text-center`}>
                <div class="flex items-center gap-4 ml-2 p-2">
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
                    <div class="font-medium dark:text-white text-left">
                        <div className='text-black'>{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Last seen 2h ago</div>
                    </div>
                </div>
            </div>
        ))}
        </ul>
    </div>
  )
}

export default ChatUsers