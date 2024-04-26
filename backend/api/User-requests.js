import axios from 'axios'

export const updateUserStatus = async (username, date, is_online) => {
    try{
        const res = await axios.post(`${process.env.BE_HOST}:5000/users/updateStatus`, {
            username: username,
            is_online: is_online ? true : false,
            last_seen: date
        })
    }catch(err){
        console.log(err)
    }
}