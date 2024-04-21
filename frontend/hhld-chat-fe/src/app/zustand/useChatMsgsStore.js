import {create} from 'zustand';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';

export const useChatMsgsStore = create( (set) => ({
   chatMsgs: [],
   updateChatMsg: (msg) => set((state) => ({ chatMsgs: [...state.chatMsgs, msg] })),
   updateChatMsgs: (chatMsgs) => set({chatMsgs}),
   updateChatMsgswithReciever: (msg) => {
      if(msg.sender === useChatReceiverStore.getState().chatReceiver){
         set((state) => ({ chatMsgs: [...state.chatMsgs, msg] }))
      }
   }
}));
