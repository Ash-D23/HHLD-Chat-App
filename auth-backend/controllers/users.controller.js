import User from "../models/user.model.js";

const getUsers = async (req, res) => {
   try {
       const users = await User.find({}, 'username');
       res.status(200).json(users);
   } catch (error) {
       console.log(error.message);	
       res.status(500).json({ message: 'Server Error' });
   }
}

export const updateUserStatus = async (req, res) => {
    try{
        const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, 
            { is_online: req.body.is_online, last_seen: req.body.last_seen}, 
            { new: true }
        );
        res.status(200).json({ msg: "user updated succesfully"})
    }catch(err){
        console.log(err)
    }
}

export default getUsers;