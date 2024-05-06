import React, { useEffect, useState } from 'react'
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useRouter } from 'next/navigation';
import { useChatSelection } from '../zustand/useChatSelection';
import UsersList from './UsersList';
import GroupList from './GroupList';


const ChatUsers = () => {
  const { chatSelection, updateChatSelection } = useChatSelection();
  const { users } = useUsersStore();
  const { authName } = useAuthStore()
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs} = useChatMsgsStore();
  const router = useRouter();

  const setChatReceiver = (data) => {
    updateChatReceiver(data);
  }

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

  const updateSelection = (selection) => {
    updateChatSelection(selection)
    setChatReceiver(null)
  }
 
  return (

    <div className="h-screen min-w-96">
        <div className='w-full h-12 bg-sky-600 px-4 py-2 text-lg border-b border-gray-200 text-white font-bold text-center'>
            My Chat App
        </div>
            <div className="sm:hidden">
                <label for="tabs" className="sr-only">Select</label>
                <select id="tabs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-2.5 ">
                    <option>Chat</option>
                    <option>Groups</option>
                    
                </select>
            </div>
            <ul className="hidden font-medium text-center border-b-2 bg-gray-200 text-gray-500 shadow sm:flex ">
                <li onClick={() => updateSelection('Chat')} className="w-full focus-within:z-10 cursor-pointer	">
                    <a className={`inline-block w-full p-3.5 cursor-pointer ${chatSelection === 'Chat' ? 'bg-gray-200' : 'bg-white'} text-gray-900 border-r border-gray-200`} aria-current="page">Chat</a>
                </li>
                <li onClick={() => updateSelection('Group')} className="w-full focus-within:z-10 cursor-pointer">
                    <a className={`inline-block w-full p-3.5 cursor-pointer ${chatSelection !== 'Chat' ? 'bg-gray-200' : 'bg-white'} text-gray-900 `}>Groups</a>
                </li>
            </ul>
        <div className='bg-white h-users-list overflow-y-scroll'>
            { chatSelection === 'Chat' ? <UsersList users={users} chatReceiver={chatReceiver} setChatReceiver={setChatReceiver} /> : 
            <GroupList chatReceiver={chatReceiver} setChatReceiver={setChatReceiver} /> }
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
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
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