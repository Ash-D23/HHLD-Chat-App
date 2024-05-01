import {create} from 'zustand';

export const useChatSelection = create( (set) => ({
    chatSelection: 'Chat',
    updateChatSelection: (selection) => set({ chatSelection: selection }),
 }));