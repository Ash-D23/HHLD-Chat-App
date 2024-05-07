"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from "./zustand/useAuthStore"

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authName, updateAuthName } = useAuthStore()

    const router = useRouter();

    useEffect(() => {
        if(authName){
            router.push('/chat')
        }
    }, [])

    const signUpFunc = async (event) => {
        event.preventDefault();
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
                updateAuthName(username)
                router.push('/chat')
            }

            
        } catch (error) {
            console.log("Error in signup function : ", error.message);
        }finally{
            setUsername('')
            setPassword('')
        }
    }

    const loginFunc = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/login`, {
                username: username,
                password: password
            },
            {
                withCredentials: true
            })
            updateAuthName(username)
            router.push('/chat')

        } catch (error) {
            console.log("Error in Login function : ", error.message);
        }finally{
            setUsername('')
            setPassword('')
        }
    }

    const loginWithTestFunc = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/login`, {
                username: "test",
                password: "test1234"
            },
            {
                withCredentials: true
            })
            console.log(res)
            updateAuthName("test")
            router.push('/chat')

        } catch (error) {
            console.log("Error in Login function : ", error.message);
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
    </div>
)
}
export default Auth