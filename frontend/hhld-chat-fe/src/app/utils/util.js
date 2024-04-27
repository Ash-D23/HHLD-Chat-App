export const dateDiff = (dateString, now) => {
    if(!dateString){
        return ""
    }
    const date = new Date(dateString);
    const diffMs = (now - date); 
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
    if(diffDays !== 0 ){
        return diffDays > 1 ? `${diffDays} days ago` : `${diffDays} day ago`
    }else if(diffHrs !== 0){
        return diffHrs > 1 ? `${diffHrs} hrs ago` : `${diffHrs} hr ago`
    }else if(diffMins !== 0){
        return diffMins > 1 ? `${diffMins} mins ago` : `${diffMins} min ago`
    }else{
        return "1 min ago"
    }
}