import React, { useEffect, useState } from 'react'
import { dateDiff } from '../utils/util'
import { useAuthStore } from '../zustand/useAuthStore'
import axios from 'axios'
import { useChatMsgsStore } from '../zustand/useChatMsgsStore'

const UsersList = ({ users, chatReceiver, setChatReceiver }) => {

    const { ChatConversationList, updateChatConversationList } = useChatMsgsStore()
    const { authName } = useAuthStore()

    const getConversationList = async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs/getConversationList`,
            {
                username: authName
            });
            updateChatConversationList(res.data)
    }

    useEffect(() => {
        getConversationList()
    }, [])

    const createConversationMap = (conversationList) => {
        
        const new_map = {}

        conversationList.forEach(element => {
            const username1 = element.users[0]
            const username2 = element.users[1]

            const username = username1 === authName ? username2 : username1
            new_map[username] = element
        });

        return new_map
    }

    const conversationMap = createConversationMap(ChatConversationList)

    const addUsersFromMap = (users) => {

        return users.map((user) => {
            const data = conversationMap[user.username]
            if(data){
                return { ...user, ...data}
            }else{
                return user
            }
        })
    }

    const userList = addUsersFromMap(users)

    const SortedUsersList = userList.sort((user1, user2) => {
        let date1 = user1.last_message ? new Date(user1.last_message) : new Date("1/1/2000")
        let date2 = user2.last_message ? new Date(user2.last_message) : new Date("1/1/2000")

        return date2 - date1

    })

    const handleItemClick = (user) => {
        setChatReceiver(user?.username)

        // update conversation list
        const updatedList = [ ...ChatConversationList ]
        // if user not in conversation map then return

        if(conversationMap[user.username]){
            updatedList.forEach((data) => {
                let username1 = data.users[0]
                let username2 = data.users[1]

                if(username1 === user.username || username2 === user.username){
                    data.unread_count = 0
                    data.last_read = new Date()
                }
            })

            updateChatConversationList(updatedList)
        }

        // for the user - update last checked, unread_count = 0

    }

  const now = new Date()
  
  return (
    <ul className="w-full text-gray-900 ">
            {SortedUsersList.map((user, index) => (
                <div  
                key={index}
                onClick={() => handleItemClick(user)}
                className={chatReceiver === user?.username ? 'bg-sky-200 w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center' : user.unread_count && user.unread_count !== 0 ? 'bg-green-200 w-full cursor-pointer flex px-4 py-2 border-b-2 border-gray-100 text-black text-center' : 'bg-white w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center'}>
                    <div className="flex items-center gap-4 ml-2 p-2 w-screen">
                        <div className="relative ">
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                                { user?.image ?  <img class="w-10 h-10 rounded-full" src={user?.image} alt="profile image"></img>:
                                  <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg> 
                                  }
                            </div>
                            { user?.is_online ? <span className="top-0 start-7 absolute w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span> : null }
                        </div>
                        <div className="font-medium dark:text-white text-left">
                            <div className='text-black'>{user.username}</div>
                            { user?.is_online ? <div className="text-sm text-gray-500 dark:text-gray-400">Online</div> : <div className="text-sm text-gray-500 dark:text-gray-400">{dateDiff(user?.last_seen, now)}</div>}
                        </div>
                        { user?.unread_count ? (<div className='grow flex justify-end mr-2'>
                            <div class="flex items-center justify-center  
                                h-6 w-6 rounded-full bg-green-600"> 
                                <span class="text-white font-bold text-sm"> 
                                    {user.unread_count}
                                </span> 
                            </div> 
                        </div>) : null }
                    </div>
                </div>
            ))}
    </ul>
  )
}

export default UsersList