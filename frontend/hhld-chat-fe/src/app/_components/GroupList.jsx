import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useGroups } from '../zustand/useGroups'

const GroupList = ({ chatReceiver, setChatReceiver }) => {

    const { groups, updateGroups } = useGroups()

    const getGroupData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/groups`,
        {
            withCredentials: true
        })
        
        updateGroups(res.data);
    }

  useEffect(()=>{
    getGroupData()
  }, [])
  console.log(groups)

  return (
    <ul className="w-full text-gray-900 ">
            {groups?.map((group, index) => (
                <div  
                key={index}
                onClick={() => setChatReceiver(group.groupName)}
                className={`${chatReceiver === group.groupName ? 'bg-sky-200' : 'bg-white'} w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center`}>
                    <div className="flex items-center gap-4 ml-2 p-2">
                        <div className="relative ">
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg> 
                            </div>
                        </div>
                        <div className="font-medium dark:text-white text-left">
                            <div className='text-black'>{group.groupName}</div>
                        </div>
                    </div>
                </div>
            ))}
    </ul>
  )
}

export default GroupList