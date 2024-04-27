import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useRouter } from 'next/navigation';
import { dateDiff } from '../utils/util';


const ChatUsers = () => {
  const { users } = useUsersStore();
  const { authName } = useAuthStore()
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs} = useChatMsgsStore();
  const router = useRouter();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  }

  console.log(users)

  useEffect(() => {
    const getMsgs = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs`,
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

  const Logout = () => {
    router.push('/logout')
  }
 
  return (

    <div className="h-screen">
        <div className='w-full h-12 bg-sky-600 px-4 py-2 text-lg border-b border-gray-200 text-white font-bold text-center'>
            My Chat App
        </div>
        <div className='bg-white h-users-list overflow-y-scroll'>
            <ul className="w-full text-gray-900 ">
            
            {users.map((user, index) => (
                <div  
                key={index}
                onClick={() => setChatReceiver(user)}
                className={`${chatReceiver === user.username ? 'bg-sky-200' : 'bg-white'} w-full flex px-4 py-2 border-b border-blue-100 text-black text-center`}>
                    <div class="flex items-center gap-4 ml-2 p-2">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                            <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                        </div>
                        <div className="font-medium dark:text-white text-left">
                            <div className='text-black'>{user.username}</div>
                            { user?.is_online ? <div className="text-sm text-gray-500 dark:text-gray-400">Online</div> : <div className="text-sm text-gray-500 dark:text-gray-400">{dateDiff(user?.last_seen, new Date())}</div>}
                        </div>
                    </div>
                </div>
            ))}
            </ul>
        </div>
        <div className='w-full h-16 bg-green-500 flex items-center px-4 py-2 text-lg text-white font-bold text-center'>
                <div className='w-16 ml-2'>
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
                </div>
                <div className="w-3/5 font-medium text-left">
                        <div className='text-white'>{authName}</div>
                </div>
                <div className='w-1/6'>
                    <div className='flex justify-center '>
                        <span className="cursor-pointer" onClick={Logout}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
                            </svg>
                        </span>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default ChatUsers