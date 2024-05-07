

export const dateDiff = (dateString, now) => {
    if(!dateString){
        return ""
    }
    const date = new Date(dateString);
    const diffMs = (now - date); 
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
    if( diffDays >= 1){
        return diffDays > 1 ? `${diffDays} days ago` : `${diffDays} day ago`
    }else if(diffHrs >= 1){
        return diffHrs >= 1 ? `${diffHrs} hrs ago` : `${diffHrs} hr ago`
    }else if(diffMins >= 1){
        return diffMins > 1 ? `${diffMins} mins ago` : `${diffMins} min ago`
    }else{
        return "1 min ago"
    }
}

export const convertTime = (data, now) => {
    if(!data){
        return
    }

    const date = new Date(data);
    
    const diffMs = (now - date); 
    const diffDays = Math.floor(diffMs / 86400000);

    if(diffDays >= 1){
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        return `${month} ${day}`
    }else{
        const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
        const formattedTime = formatter.format(date);
        return formattedTime
    }
}