import React from 'react'
import { convertTime } from '../utils/util'
import { useUsersStore } from '../zustand/useUsersStore';
import { useAuthStore } from '../zustand/useAuthStore';

const ChatMessage = ({msg }) => {

    const { users } = useUsersStore();
    const { authName, userData } = useAuthStore()

    const getImageByUser = (username) => {
        if(username === authName){
            return userData.image
        }
        return users.find((user) => user.username === username)?.image
    }

    const image = getImageByUser(msg.sender)

  return (
    <div className={`flex ${msg.sender === authName ? "justify-end" : "justify-start"} items-start gap-2.5 p-2`}>
        <div className="relative w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
            { image ? <img class="w-10 h-10 rounded-full" src={image} alt="profile image"></img> : 
            <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            }</div>
        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${msg.sender === authName ? "bg-green-300" : "bg-blue-200"} rounded-e-xl rounded-es-xl`}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900">{msg.sender}</span>
                <span className="text-sm font-normal text-gray-500 dark:text-blacky-400">{convertTime(msg.createdAt, new Date())}</span>
            </div>
            <p className="text-sm font-normal py-2.5 text-gray-900">{msg.text}</p>
        </div>
    </div>
  )
}

export default ChatMessage