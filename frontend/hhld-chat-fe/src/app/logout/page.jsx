'use client'
import React, { useEffect } from 'react'
import { useAuthStore } from '../zustand/useAuthStore'
import { useRouter } from 'next/navigation';

const Logout = () => {

const { updateAuthName } = useAuthStore();
const router = useRouter();

  useEffect(()=>{
    updateAuthName('')
    router.push('/')
  }, [])

  return (
    <div>Loading...</div>
  )
}

export default Logout