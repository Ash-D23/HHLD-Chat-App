import { create } from 'zustand'
import { useAuthStore } from './useAuthStore';

export const useUsersStore = create( (set) => ({
    users: [],
    updateUsers: (users) => set({ users: users.filter((user) => user?.username !== useAuthStore.getState().authName) }),
    UpdateUserStatus: (user) => set((state) => ({ users: state.users.map((data) => {
        if(data?.username === user.username){
            return {...data, ...user}
        }else{
            return data
        }
    }) }))
 }));
 