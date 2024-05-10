import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    Owner: {
        type: String,
        required: true
    },
    members: [{
        type: String,
        required: true
    }]
 });

 const groups = mongoose.model('Groups', groupSchema);

 export default groups;