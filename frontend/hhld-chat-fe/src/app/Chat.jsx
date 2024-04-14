'use client'
import React, {useState, useEffect} from 'react';
import io from "socket.io-client";

const Chat = () => {

    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);
        // Listen for incoming msgs
        newSocket.on('chat msg', (msgrecv) => {
            console.log('received msg on client ' + msgrecv);
            setMsgs(prev => [...prev, {msg: msgrecv, currentUserMsg: false}])
        })
        // Clean up function
        return () => newSocket.close();
    },[]);

    const sendMsg = (e) => {
        e.preventDefault();
        if(socket) {
            socket.emit('chat msg', msg);
            setMsgs([...msgs, { msg: msg, currentUserMsg: true }]);
            setMsg('');
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <div className='msgs-container h-4/5 overflow-y-scroll  p-6 pt-2 pb-0'>
                {msgs.map((msg, index) => (
                    <div key={index} className={ `msg text-right flex ${msg.currentUserMsg ? "justify-end" : ""}` }>
                        <p className='rounded-md border-0 p-2.5 m-2 bg-blue-700  text-white'>{msg?.msg}</p>
                    </div>
                ))}
            </div>
            <div className='h-1/5 flex items-center justify-center'>
                <form onSubmit={sendMsg} className='p-6 pt-2 w-full'>
                    <div className="relative">
                        <input 
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            type="search" id="search" className="block w-full p-4 ps-6 text-sm text-gray-900 border border-blue-300 rounded-lg bg-white-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Send Message" required />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat