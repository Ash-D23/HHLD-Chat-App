import {create} from 'zustand';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useAuthStore } from './useAuthStore';
import axios from 'axios';

const updateChatRecievedToDB = async (msg, username) => {
   const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs/updateChatConversation`,
        {
            users: [msg.sender, msg.receiver],
            username: username
        })
}

const updateGroupRecievedToDB = async (msg, username) => {
   const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs/updateGroupConversation`,
        {
            groupName: msg.groupName,
            username: username
        })
}

export const useChatMsgsStore = create( (set) => ({
   chatMsgs: [],
   ChatConversationList: [],
   GroupConversationList: [],
   updateChatMsg: (msg) => set((state) => ({ chatMsgs: [...state.chatMsgs, msg] })),
   updateChatMsgs: (chatMsgs) => set({chatMsgs}),
   updateChatMsgswithReciever: (msg) => {
      const username = useAuthStore.getState().authName
      if(msg.sender === useChatReceiverStore.getState().chatReceiver && !msg.groupName){
         set((state) => ({ chatMsgs: [...state.chatMsgs, msg] }))
         // update conversation in db as read by username
         updateChatRecievedToDB(msg, username)
      }else if(msg.sender !== useChatReceiverStore.getState().chatReceiver && !msg.groupName){
         // Update Chat ConverationList
         set((state) => ({
            ChatConversationList: state.ChatConversationList.map((chat)=>{
               if(chat.users[0] === msg.sender || chat.users[1] === msg.sender){
                  chat.unread_count += 1
                  chat.last_message = new Date()

                  return {...chat}
               }else{
                  return chat
               }
            })
         }))
      }else if(msg.groupName === useChatReceiverStore.getState().chatReceiver){
         set((state) => ({ chatMsgs: [...state.chatMsgs, msg] }))
         // update conversation in db as read by username
         updateGroupRecievedToDB(msg, username)
      }else if(msg.groupName !== useChatReceiverStore.getState().chatReceiver){
         // update GroupConversationList
         set((state) => ({
            GroupConversationList: state.GroupConversationList.map((group)=>{
               if(group.groupName === msg.groupName){
                  group.unread_count += 1
                  group.last_message = new Date()

                  return {...group}
               }else{
                  return group
               }
            })
         }))
      }

   },
   updateChatConversationList: (data) => set({ ChatConversationList: data}),
   updateGroupConversationList: (data) => set({ GroupConversationList: data}),
   addNewGroupConversation: (group) => {
      set((state) => ({ GroupConversationList: [...state.GroupConversationList, {
         ...group,
         unread_count: 0,
         last_message: new Date()
      }] }))
   },
   updateChatConversationOnSend: (msg) => {

      set((state) => {
         const newArr = [...state.ChatConversationList]
         const index = newArr.findIndex((data) => {
            if(data.users[0] === msg.receiver || data.users[1] === msg.receiver ){
               return true
            }else{
               return false
            }
         })

         if(index===-1){
            newArr.push({
               users: [msg.sender, msg.receiver],
               unread_count: 0,
               last_message: new Date(),
               last_read: new Date()
            })
         }else{
            newArr[index].last_message = new Date()
            newArr[index].last_read = new Date()
         }

         return {
            ChatConversationList: newArr
         }
      })
   },
   updateGroupConversationOnSend: (msg) => {
      set((state) => {
         const newArr = [...state.GroupConversationList]
         const index = newArr.findIndex((data) => {
            if(data.groupName === msg.groupName ){
               return true
            }else{
               return false
            }
         })

         if(index !==-1){
            newArr[index].last_message = new Date()
            return {
               GroupConversationList: newArr
            }
         }else{
            return state
         }

         
      })
   }

}));
