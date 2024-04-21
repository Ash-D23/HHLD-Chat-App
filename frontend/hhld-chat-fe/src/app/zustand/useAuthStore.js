import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            authName: '',
            updateAuthName: (userName) => set((state) => ({ authName: userName}))
        }),
        {
            name: 'auth-storage'
        }
    )
)