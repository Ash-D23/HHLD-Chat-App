import User from "../models/user.model.js";

export const getGroups = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId}, 'groups');
        res.status(200).json(user?.groups);
    } catch (error) {
        console.log(error.message);	
        res.status(500).json({ message: 'Server Error' });
    }
 }