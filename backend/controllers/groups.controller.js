import groups from "../models/group.model.js";
import axios from 'axios'

export const addGroup = async (req, res) => {
    try {
        const {groupName, Owner, members} = req.body;
        console.log(req.body)
        const foundgroup = await groups.findOne({groupName});
        if(foundgroup) {
            res.status(201).json({message: 'Group Name already exists'});
        } else {
            const group = new groups({groupName: groupName, Owner: Owner, members: members});
            await group.save();

            //Add in User's schema
            const result = await axios.post(`${process.env.BE_HOST}:5000/users/updateUsersGroup`, {
                groupName: groupName,
                userlist: members
            })

            res.status(201).json({message: 'Group Created Succesfully'});
        }
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: "Group creation failed!"});
    }
}

