import React from 'react'

const StartConversation = ({ selection }) => {
  return (
     selection === 'Chat' ? (
            <div className='flex items-center justify-center p-10'>
                <img src="/chat.svg" />
            </div>
        ) : (
            <div className='h-full'>
                <div className='h-4/6 flex items-center justify-center p-10'>
                    <img src="/group.png" />
                </div>
                <div className='h-2/6 flex flex-col items-center justify-center p-10 pb-3 w-full'>
                    <p class="text-2xl font-bold text-gray-900 text=center m-3 ">Let's start a group chat</p>
                    <button type="button" class="focus:outline-none text-white bg-green-600 hover:bg-green-700  font-medium rounded-lg px-5 py-2.5 me-2 mb-2">Create Group</button> 
                </div>
            </div>
        ) 
  )
}

export default StartConversation