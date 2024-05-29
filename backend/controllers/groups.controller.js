import groups from "../models/group.model.js";
import Conversation, { userReads } from "../models/chat.model.js";

export const addGroup = async (req, res) => {
    try {
        const {groupName, Owner, members} = req.body;

        const foundgroup = await groups.findOne({groupName});
        if(foundgroup) {
            res.status(201).json({message: 'Group Name already exists'});
        } else {
            const group = new groups({groupName: groupName, Owner: Owner, members: members});
            await group.save();

            let conversation = await Conversation.create({ users: members, groupName: groupName, isGroup: true });

            members.forEach((user) => {
                const userRead = new userReads({
                    username: user,
                    unread_count: 0
                })
                conversation.last_checked.push(userRead)
            })
            
            conversation.last_message = new Date()
            await Conversation.findOneAndUpdate({ _id: conversation._id }, { ...conversation })

            res.status(201).json({message: 'Group Created Succesfully'});
        }
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: "Group creation failed!"});
    }
}

export const getGroups = async (req, res) => {
    try {
        const {username} = req.body;

        const foundgroups = await groups.find({members: { $all: [username] }}, 'groupName members')

        res.status(201).json(foundgroups);

    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: "Error fetching groups"});
    }
}

