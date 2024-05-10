import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            authName: '',
            userData: {},
            updateAuthName: (userName) => set((state) => ({ authName: userName})),
            updateUserData: (data) => set((state) => ({ userData: data, authName: data.username })),
            clearUserData: () => set({ authName: '', userData: {}})
        }),
        {
            name: 'auth-storage'
        }
    )
)