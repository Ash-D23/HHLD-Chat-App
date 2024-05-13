import {create} from 'zustand';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';

export const useChatMsgsStore = create( (set) => ({
   chatMsgs: [],
   ChatConversationList: [],
   GroupConversationList: [],
   updateChatMsg: (msg) => set((state) => ({ chatMsgs: [...state.chatMsgs, msg] })),
   updateChatMsgs: (chatMsgs) => set({chatMsgs}),
   updateChatMsgswithReciever: (msg) => {
      if(msg.sender === useChatReceiverStore.getState().chatReceiver && !msg.groupName){
         set((state) => ({ chatMsgs: [...state.chatMsgs, msg] }))
      }else if(msg.groupName === useChatReceiverStore.getState().chatReceiver){
         set((state) => ({ chatMsgs: [...state.chatMsgs, msg] }))
      }
   },
   updateChatConversationList: (data) => set({ ChatConversationList: data}),
   updateGroupConversationList: (data) => set({ GroupConversationList: data})
}));
