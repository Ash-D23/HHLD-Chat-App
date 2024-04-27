import axios from 'axios'

export const updateUserStatus = async (username, date, status) => {
    try{
        const res = await axios.post(`${process.env.BE_HOST}:5000/users/updateStatus`, {
            username: username,
            is_online: status,
            last_seen: date
        })
    }catch(err){
        console.log(err.message)
    }
}