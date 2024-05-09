import groups from "../models/group.model.js";

export const addGroup = async (req, res) => {
    try {
        const {groupName, Owner, members} = req.body;

        const foundgroup = await groups.findOne({groupName});
        if(foundgroup) {
            res.status(201).json({message: 'Group Name already exists'});
        } else {
            const group = new groups({groupName: groupName, Owner: Owner, members: members});
            await group.save();

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

