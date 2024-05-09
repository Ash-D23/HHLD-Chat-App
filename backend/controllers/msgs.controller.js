import Conversation from "../models/chat.model.js";
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
            conversation = await Conversation.create({ users: participants, groupName: groupName });
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
            conversation = await Conversation.create({ users: participants, groupName: null });
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
        return res.json(conversation.msgs);
 
 
 
 
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 };

 export const getGroupMsgsForConversation = async (req, res) => {
    try {
        const { groupName  } = req.body;
        // Find participants from groupName

        const foundgroup = await groups.findOne({groupName});

        if(!foundgroup){
            console.log("No group found")
            return res.status(200).send();
        }

        // Find conversation by participants
        const conversation = await Conversation.findOne({ users: { $all: foundgroup.members }, groupName: groupName });
        if (!conversation) {
            console.log('Conversation not found');
            return res.status(200).send();
        }
        return res.json(conversation.msgs);

 
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 }

 export default getMsgsForConversation;