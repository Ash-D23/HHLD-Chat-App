import bcrypt from "bcrypt";
import User from "../models/user.model.js"
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const foundUser = await User.findOne({username});
        if(foundUser) {
            res.status(201).json({message: 'Username already exists'});
        } else {
            const user = new User({username: username, password: hashedPassword});
            const result = await user.save();
            generateJWTTokenAndSetCookie(user._id, res);
            res.status(201).json({message: 'User signed up successfully', userData: {username: result.username}});
        }
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: "User reg failed!"});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const foundUser = await User.findOne({username});
        if(!foundUser) {
            res.status(201).json({message: 'User Not Found'});
        } else {
            const passwordMatch = await bcrypt.compare(password, foundUser?.password)
            
            if(!passwordMatch){
                res.status(401).json({message: 'Auth Failed'})
            }
            else{
                generateJWTTokenAndSetCookie(foundUser?._id, res);
                res.status(201).json({message: 'User login successfully', userData: {username: foundUser.username, image: foundUser.image}});
            }
        }
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: "User reg failed!"});
    }
}

export default signup