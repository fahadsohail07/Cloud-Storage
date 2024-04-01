export function getUTCTime(){
    var now = new Date;
    var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

    return utc_timestamp
}

export function convertToUTCTime(date){
    var now = new Date(date);
    var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

    return utc_timestamp
}

export function convertUTCDateToLocalDate(date) {
    let newDate = new Date(date * 1000);
    let offset = new Date().getTimezoneOffset();
    newDate = new Date(newDate.getTime());
    return newDate;   
}