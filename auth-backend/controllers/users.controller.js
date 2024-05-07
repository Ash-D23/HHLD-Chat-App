import User from "../models/user.model.js";

const getUsers = async (req, res) => {
   try {
       const users = await User.find({}, 'username image is_online last_seen');
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
        console.log(err.message)
    }
}

export const updateUsersGroup = async (req, res) => {
    try{
        const { groupName, members } = req.body

        for(let userName of members){

            let user = await User.findOne({ username: userName });

            // If conversation doesn't exist, create a new one
            if (!user) {
                throw new Error('user not found')
            }

            // Add msg to the conversation
            if(user.groups){
                user.groups.push({ groupName, members})
            }else{
                user.groups = [{groupName, members}]
            }
            await user.save();
        }
        res.status(201).json({message: 'Groups added to Userlist'});

    }catch(err){
        console.log(err.message)
    }
}

export default getUsers;