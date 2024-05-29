import axios from 'axios'
import React, { useEffect } from 'react'
import { useGroups } from '../zustand/useGroups'
import { useChatMsgsStore } from '../zustand/useChatMsgsStore'
import { useAuthStore } from '../zustand/useAuthStore'

const GroupList = ({ chatReceiver, setChatReceiver }) => {

  const { groups } = useGroups()
  const { GroupConversationList, updateGroupConversationList } = useChatMsgsStore()
  const { authName } = useAuthStore()

  const getGroupConversationList = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs/getGroupConversationList`,
        {
            username: authName
        });
        updateGroupConversationList(res.data)
    }

    useEffect(() => {
        getGroupConversationList()
    }, [])

    const createConversationMap = (conversationList) => {

        const new_map = {}

        conversationList.forEach(element => {
            new_map[element.groupName] = element
        });

        return new_map
    }

    const conversationMap = createConversationMap(GroupConversationList)

    const addGroupsFromMap = (groups) => {

        return groups.map((group) => {
            const data = conversationMap[group.groupName]
            if(data){
                return { ...group, ...data}
            }else{
                return group
            }
        })
    }

    const groupList = addGroupsFromMap(groups)

    const SortedGroupsList = groupList.sort((group1, group2) => {
        let date1 = group1.last_message ? new Date(group1.last_message) : new Date("1/1/2000")
        let date2 = group2.last_message ? new Date(group2.last_message) : new Date("1/1/2000")

        return date2 - date1

    })

    const handleItemClick = (group) => {
        setChatReceiver(group.groupName)

        // update conversation list
        const updatedList = [ ...GroupConversationList ]
        // if user not in conversation map then return

        if(conversationMap[group.groupName]){
            updatedList.forEach((data) => {
                

                if(data.groupName === group.groupName){
                    data.unread_count = 0
                    data.last_read = new Date()
                }
            })

            updateGroupConversationList(updatedList)
        }
    }

  return (
    <ul className="w-full text-gray-900 ">
            {SortedGroupsList?.map((group, index) => (
                <div  
                key={index}
                onClick={() => handleItemClick(group)}
                className={chatReceiver === group.groupName ? 'bg-sky-200 w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center' : group.unread_count && group.unread_count !== 0 ? 'bg-green-200 w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center' : 'bg-white w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center'}>
                    <div className="flex items-center gap-4 ml-2 p-2 w-screen">
                        <div className="relative ">
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg> 
                            </div>
                        </div>
                        <div className="font-medium dark:text-white text-left">
                            <div className='text-black'>{group.groupName}</div>
                        </div>
                        { group?.unread_count ? (<div className='grow flex justify-end mr-2'>
                            <div class="flex items-center justify-center  
                                h-6 w-6 rounded-full bg-green-600"> 
                                <span class="text-white font-bold text-sm"> 
                                    {group.unread_count}
                                </span> 
                            </div> 
                        </div>) : null }
                    </div>
                </div>
            ))}
    </ul>
  )
}

export default GroupList