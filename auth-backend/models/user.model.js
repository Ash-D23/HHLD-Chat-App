import mongoose from "mongoose";

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
    groups : [{
        type: String
    }]
});

const userModel = mongoose.model('User', userSchema);
export default userModel;