"use client"
import React, { useState } from 'react'
import { useUsersStore } from '../zustand/useUsersStore';
import { useAuthStore } from '../zustand/useAuthStore';
import axios from 'axios';
import { useGroups } from '../zustand/useGroups';
import { toast } from 'react-toastify';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';

const AddGroupModal = ({ closeModal, sendAddGroupNotification }) => {

   const { users } = useUsersStore();
   const { authName } = useAuthStore()
   const [selectedUsers, setSelectedUsers] = useState(new Set())
   const [search, setSearch] = useState('')
   const [groupName, setGroupName] = useState('')
   const { addGroups } = useGroups() 
   const { addNewGroupConversation } = useChatMsgsStore();

   const addSelectedUser = user => {
    setSelectedUsers(prev => new Set(prev.add(user)))
   }

   const removeSelectedUser = user => {
    setSelectedUsers(prev => new Set([...prev].filter(x => x !== user)))
   }

   const isSelectedUser = (user) => {
        return selectedUsers.has(user)
   }

   const setChecked = (user) => {
        if(isSelectedUser(user)){
            removeSelectedUser(user)
        }else{
            addSelectedUser(user)
        }
   }

   const handleClose = (e) => {
    setSearch('')
    setGroupName('')
    setSelectedUsers(new Set())
    closeModal()
   }

   const submitGroup = async (e) => {
        e.preventDefault()

        try{
            const members = [...selectedUsers, authName]
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/groups/add`, {
                groupName: groupName,
                Owner: authName,
                members: members
            })
    

            addGroups({groupName, members, Owner: authName })
            addNewGroupConversation({groupName, members, Owner: authName })

            toast.success(`Group: ${groupName} Created`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
                });

            sendAddGroupNotification(groupName, authName, members)

        }catch(err){
            console.log(err.message)
        }finally{
            handleClose()
        }

        
   }

   const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()))



  return (
    <div className='overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen w-screen bg-gray-600 bg-opacity-50'>
                    <div class="relative p-4 w-full max-w-md max-h-full">

                        <div class="relative bg-white rounded-lg shadow">

                            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 class="text-xl font-semibold text-gray-900">
                                    Create Group
                                </h3>
                                <button onClick={handleClose} type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="p-4 md:p-5">
                                <div class="space-y-4">
                                    <div>
                                        <label for="text" class="block mb-2 text-sm font-medium text-gray-900">Enter Group Name</label>
                                        <input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName} name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Group Name" required />
                                    </div>
                                    <div class="flex flex-col justify-between">
                                        <div>
                                        <form class="max-w-md mx-auto mb-2">   
                                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                                            <div class="relative">
                                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                    </svg>
                                                </div>
                                                <input type="search" onChange={(e) => setSearch(e.target.value)} id="default-search" value={search} class="block w-full p-2 focus:outline-none ps-10 text-sm text-gray-900 border-b border-gray-300 rounded-lg bg-gray-50 " placeholder="Add Members..." required />
                                            </div>
                                        </form>
                                        </div>
                                        <div>
                                            { filteredUsers.length !== 0 ? (<ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-300 max-h-48 min-h-4 overflow-y-scroll">
                                                {
                                                    filteredUsers?.map((user, index) => {
                                                        return(
                                                            <li class="p-2 pl-0" key={index}>
                                                                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                                                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                                                                    { user?.image ?  <img class="w-10 h-10 rounded-full" src={user?.image} alt="profile image"></img> :
                                                                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg> 
                                                                    } 
                                                                    </div>
                                                                    <div class="flex-1 min-w-0 ">
                                                                        <p class="text-sm font-medium text-gray-900 truncate pl-1">
                                                                            {user?.username}
                                                                        </p>
                                                                    </div>
                                                                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white pr-2">
                                                                        <input id="link-checkbox" onClick={() => setChecked(user?.username)} type="checkbox" checked={isSelectedUser(user?.username)} value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                    
                                                }
                                            </ul>) : (
                                                <div className='flex p-2 justify-center items-center'>
                                                    <p>No users found</p>
                                                </div>
                                            )
                                            
                                            }
                                        </div>
                                    </div>
                                    <button type="submit" onClick={submitGroup} class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Group</button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default AddGroupModal