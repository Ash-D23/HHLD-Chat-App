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

const conversationSchema = mongoose.Schema({
   users: [{
       type: String,
       required: true
   }],
   msgs: [msgSchema],
   groupName: {
    type: String
   }
});

const conversation = mongoose.model('Conversation', conversationSchema);

export default conversation;
