import mongoose from "mongoose";

const msgSchema = mongoose.Schema({
   text: {
       type: String,
       required: true
   },
   sender: {
       type: String,
       required: true
   },
   createdAt: {
       type: Date,
       default: Date.now
   }
});

const userReadsSchema = mongoose.Schema({
    username: {
        type: String
    },
    last_read: {
        type: Date
    },
    unread_count: {
        type: Number
    }
})

const conversationSchema = mongoose.Schema({
   users: [{
       type: String,
       required: true
   }],
   msgs: [msgSchema],
   groupName: {
        type: String
   },
   last_message: {
        type: Date,
        default: Date.now
    },
   last_checked: [userReadsSchema],
   isGroup: {
        type: Boolean
   }
});

export const userReads = mongoose.model('userReads', userReadsSchema)

const conversation = mongoose.model('Conversation', conversationSchema);

export default conversation;
