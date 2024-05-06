import {create} from 'zustand';

export const useGroups = create( (set) => ({
    groups: [],
    updateGroups: (groups) => set({ groups: groups }),
    addGroups: (groupName) => set((state) => ({ groups: [...state.groups, groupName]}))
 }));