import { DocumentSnapshot } from "firebase/firestore";

function docSnapToAttendanceUser(snap:DocumentSnapshot)
{
    //@NOTICE-if snapshot is undefined, returned user data is aswell
    const snapData = snap.data();
    let user = {photoURL:"",displayName:"",email:"", emailVerified:false, created_UNIX_MILLIS: 0, uid: ""} as attendanceUser;
    const keys = Object.keys(user);

    //@ts-ignore
    keys.forEach((key => user[key] = snapData![key]))

    if(user.uid)
    {
    return user;
    }
    else{
        let failedUser = {} as attendanceUser;
        return failedUser;
    }
}
interface attendanceUser {
    photoURL: string;
    displayName: string;
    email:string;
    emailVerified: boolean;
    uid: string;
    created_UNIX_MILLIS: number; 
}
function compareArrays(arr1: any[] , arr2: any[]) :boolean
{
    if(!arr1 || !arr2)
    {
        return false;
    }
    if(arr1.length != arr2.length)
    {
        return false;
    }
for(let i = 0; i < arr1.length; i++)
{
    if(!arr2.includes(arr1[i]))
    {
        return false;
    }
    }
return true;
}
export {docSnapToAttendanceUser,attendanceUser, compareArrays}