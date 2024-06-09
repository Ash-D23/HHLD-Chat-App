"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from "./zustand/useAuthStore"

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { authName, updateUserData } = useAuthStore()

    const router = useRouter();

    useEffect(() => {
        if(authName){
            router.push('/chat')
        }
    }, [])

    const signUpFunc = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/signup`, {
                username: username,
                password: password
            },
            {
                withCredentials: true
            })

            if(res.data.message === "Username already exists") {
                console.log('Username already exists');
            } else{
                updateUserData(res.data?.userData)
                router.push('/chat')
            }

            
        } catch (error) {
            console.log("Error in signup function : ", error.message);
            setIsLoading(false)
        }finally{
            setUsername('')
            setPassword('')

        }
    }

    const loginFunc = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/login`, {
                username: username,
                password: password
            },
            {
                withCredentials: true
            })
            updateUserData(res.data?.userData)
            router.push('/chat')

        } catch (error) {
            console.log("Error in Login function : ", error.message);
            setIsLoading(false)
        }finally{
            setUsername('')
            setPassword('')

        }
    }

    const loginWithTestFunc = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/login`, {
                username: "test",
                password: "test1234"
            },
            {
                withCredentials: true
            })
            updateUserData(res.data?.userData)
            router.push('/chat')

        } catch (error) {
            console.log("Error in Login function : ", error.message);
            setIsLoading(false)
        }finally{
            setUsername('')
            setPassword('')
            
        }
    }


return (
    <div className="auth-image flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-sky-100">
        <div className="w-full bg-sky-200 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0  dark:border-sky-700">
            <div>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <h2 className="text-center text-sky-700 font-bold text-3xl">Chat Bubble</h2>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-5" >
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                                <div className="mt-2">
                                    <input id="username"
                                    name="username"
                                    type="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0
                                    p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400
                                    sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium leading-6text-gray-900">Password</label>
                                </div>
                                <div className="mt-2">
                                    <input id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0
                                    p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400
                                    sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            <div>
                            <div className="flex">
                                <button type="submit" onClick={signUpFunc} className="flex
                                m-2 w-1/2 justify-center rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold
                                leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-blue-600">Sign Up</button>
                                <button type="submit" onClick={loginFunc} className="flex
                                m-2 w-1/2 justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold
                                leading-6 text-white shadow-sm hover:bg-sky-700 focus-visible:outline
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-blue-600">Login</button>

                            </div>
                            <div className="mt-1.5 w-full">
                                <button type="submit" onClick={loginWithTestFunc} className="flex btn-test-width justify-center
                                    m-2 w-full rounded-md bg-sky-700 px-3 py-1.5 text-sm font-semibold
                                    leading-6 text-white shadow-sm hover:bg-sky-800 focus-visible:outline
                                    focus-visible:outline-2 focus-visible:outline-offset-2
                                    focus-visible:outline-indigo-600">Login with test Credentials</button>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        { isLoading ? (
            <div className="bg-opacity-50 bg-gray-800 h-screen w-screen absolute flex justify-center items-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : null}
    </div>
)
}
export default Auth