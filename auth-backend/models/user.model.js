import mongoose from "mongoose";

const userGroupSchema = mongoose.Schema({
    groupName: {
        type: String
    },
    members: [{
        type: String
    }]
    
 });

const userSchema = mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    image : {
        type: String
    },
    last_seen : {
        type: String
    },
    is_online : {
        type: Boolean
    },
    groups : [userGroupSchema]
});

const userModel = mongoose.model('User', userSchema);
export default userModel;