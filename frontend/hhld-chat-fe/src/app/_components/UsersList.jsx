import React from 'react'
import { dateDiff } from '../utils/util'

const UsersList = ({ users, chatReceiver, setChatReceiver }) => {
    
  const now = new Date()
  
  return (
    <ul className="w-full text-gray-900 ">
            {users.map((user, index) => (
                <div  
                key={index}
                onClick={() => setChatReceiver(user?.username)}
                className={`${chatReceiver === user?.username ? 'bg-sky-200' : 'bg-white'} w-full cursor-pointer flex px-4 py-2 border-b border-blue-100 text-black text-center`}>
                    <div className="flex items-center gap-4 ml-2 p-2">
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
                    </div>
                </div>
            ))}
    </ul>
  )
}

export default UsersList