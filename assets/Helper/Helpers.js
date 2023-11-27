import moment from 'moment';

export const returnInitialOfNames = ({ fsname, lsname }) => {
    if(fsname && fsname.length > 0 && lsname && lsname.length > 0){

        fsname = fsname.toString().trim();
        lsname = lsname.toString().trim();
        return `${fsname.substring(0,1)}${lsname.substring(0,1)}`;

    }else{
        return "--"
    }
};

export const keys = {
    "loginState": "loginState",
    "token": "token"
};

export const sessionExpires = (( 1000 * 3600 ) * 3); //means for 3 hours

export const datePlusSomeDays = ({ days }) => {
    switch (parseInt(days)) {
        case 1:
            days = 30;
            break;
        case 2:
            days = 60;
            break;
        case 3:
            days = 90;
            break;
        case 4: 
            days = 365;
            break;
        default:
            days = 30;
            break;
    }
    const daysplus = moment().add(parseInt(days), 'days').format('L');
    return daysplus;
};

export const calcMinimumDate = ({ agerequired }) => {
    const earlier = moment().add(parseInt(agerequired), 'years').unix();
    return earlier;
};

export const emailValidator = ({ email }) => {
    if((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/).test(email.toString().toLowerCase())) return true;
    else return false;
};

export const convertStringIntoArray = ({ chaine }) => {
    let b = chaine.toString();
    b = b.replace("[", "");
    b = b.replace("]", "");
    b = b.replace(/\"/g, "");
    b = b.split(",");
    return b;
};

export const fillphone = ({ phone }) => {
    switch (phone.charAt(0)) {
        case 0: return String(phone);
        case '0': return String(phone);
        case '+': return String(`0${phone.substring(4)}`);
        case 2: return String(`0${phone.substring(3)}`);
        default: return String(`0${phone}`);
    }
};

export const remove_0_ToPhone_Number = ({ phone }) => {
    switch (phone.charAt(0)) {
        case 0: return String(`${phone.substring(1)}`);
        case '0': return String(`${phone.substring(1)}`);
        case '+': return String(`${phone.substring(4)}`);
        case 2: return String(`${phone.substring(3)}`);
        default: return String(`${phone}`);
    }
};

export const fillPhoneNumber = ({ phone }) => {
    switch (phone.charAt(0)) {
        case 0: return String(phone);
        case '0': return String(phone);
        case '+': return String(`0${phone.substring(4)}`);
        case 2: return String(`0${phone.substring(3)}`);
        default: return String(`0${phone}`);
    }
};

export const randomString = ({ length }) => {
    return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
};

export const replaceString = ({ string, tag, replaceWith }) => {
    // string = string ? String(string) : "";
    return "Test"//typeof string === "string" ? string.replace(tag, replaceWith ) : string
};

export const returnSouscriptipnCategory = ({ category }) => {
    category = parseInt(category);

    switch (category) {
        case 1:
            return "info météo"
        case 2:
            return "info prix du marché";
        case 3:
            return "info conseils agricoles";
        default:
            return ""
    }
};