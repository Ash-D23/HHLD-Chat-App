import Conversation, { userReads } from "../models/chat.model.js";
import groups from "../models/group.model.js";

export const addMsgToConversation = async (participants, msg, isGroup, groupName) => {
   if(isGroup){
    addToGroupConversation(participants, msg, groupName)
   }else{
    addToConversation(participants, msg)
   }
};

const addToGroupConversation = async (participants, msg, groupName) => {
    try {
        // Find conversation by participants
        let conversation = await Conversation.findOne({ users: { $all: participants }, groupName: groupName });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({ users: participants, groupName: groupName, isGroup: true });
        }
        // Add msg to the conversation
          conversation.msgs.push(msg);
          await conversation.save();
    } catch (error) {
        console.log('Error adding message to conversation: ' + error.message);
    }
}

const addToConversation = async (participants, msg) => {
    
    try {
        // Find conversation by participants
        let conversation = await Conversation.findOne({ users: { $all: participants }, groupName: null });
 
        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({ users: participants, groupName: null, isGroup: false });
        }
        // Add msg to the conversation
          conversation.msgs.push(msg);
          await conversation.save();
    } catch (error) {
        console.log('Error adding message to conversation: ' + error.message);
    }
}


const getMsgsForConversation = async (req, res) => {
    try {
        const { sender, receiver } = req.query;
        const participants = [sender, receiver];
        // Find conversation by participants
        const conversation = await Conversation.findOne({ users: { $all: participants }, groupName: null });
        if (!conversation) {
            return res.status(200).send();
        }

        // Update last checked by user
        updateConversationLastChecked(conversation._id, sender)
        return res.json(conversation.msgs);
 
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 };

 export const getGroupMsgsForConversation = async (req, res) => {
    try {
        const { groupName, sender } = req.body;
        // Find participants from groupName

        const foundgroup = await groups.findOne({groupName});

        if(!foundgroup){
            console.log("No group found")
            return res.status(200).send();
        }

        // Find conversation by participants
        const conversation = await Conversation.findOne({ users: { $all: foundgroup.members }, groupName: groupName });
        if (!conversation) {
            return res.status(200).send();
        }

        // Update last checked by user
        updateConversationLastChecked(conversation._id, sender)
        return res.json(conversation.msgs);

 
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 }

const updateConversationLastChecked = async (id, username) => {
    try{
        const conversation = await Conversation.findOne({ _id: id });

        // check if conversation exist
        if (!conversation) {
            return
        }

        // update last checked by user
        
        const userRead = new userReads({
            username: username,
            unread_count: 0
        })

        // if user not there in conversation push it
        const ele = conversation.last_checked?.find((ele) => ele.username === username)
        if(!ele){
            if(conversation.last_checked){
                conversation.last_checked.push(userRead)
            }else{
                conversation.last_checked = [userRead]
            }
        }else{
            conversation.last_checked.forEach((ele) => {
                if(ele.username === username){
                    ele.unread_count = 0,
                    ele.last_read = new Date()
                }
            })
        }

        await conversation.save();

    }catch(err){
        console.log(err.message)
    }
}

export const getConversationForUser = async (req, res) => {
    const { username } = req.body
    try{
        const conversations = await Conversation.find({ users: { $all: [username] }, groupName: null });

        const results = conversations.map((data) => {

            const last_checked_data = {}

            data.last_checked?.forEach((ele) => {
                if(ele.username === username){
                    last_checked_data.unread_count = ele.unread_count
                    last_checked_data.last_read = ele.last_read
                }
            })

            return {
                users: data.users,
                last_message: data.last_message,
                unread_count: last_checked_data?.unread_count,
                last_read: last_checked_data?.last_read
            }
        })

        return res.json(results);

    }catch(err){
        console.log(err.message)
        res.status(500).json({ error: 'Server error' });
    }
}

export const getGroupConversationForUser = async (req, res) => {
    const { username } = req.body
    try{
        const conversations = await Conversation.find({ users: { $all: [username] }, isGroup: true });

        const results = conversations.map((data) => {

            const last_checked_data = {}

            data.last_checked?.forEach((ele) => {
                if(ele.username === username){
                    last_checked_data.unread_count = ele.unread_count
                    last_checked_data.last_read = ele.last_read
                }
            })

            return {
                users: data.users,
                groupName: data.groupName,
                last_message: data.last_message,
                unread_count: last_checked_data?.unread_count,
                last_read: last_checked_data?.last_read
            }
        })

        return res.json(results);

    }catch(err){
        console.log(err.message)
        res.status(500).json({ error: 'Server error' });
    }
}

 export default getMsgsForConversation;