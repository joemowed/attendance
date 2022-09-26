import { user } from "firebase-functions/v1/auth";
import { FirebaseApp } from "firebase/app";
import { Auth, User } from "firebase/auth";
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

function getCollectionName(user1:User, user2:attendanceUser)
{
    let sum1 = 0;
    let sum2 = 0;
    for(let i=0; i<user1.uid.length; i++)
    {
        sum1 += user1.uid.charCodeAt(i)
    }
    for(let i = 0; i < user2.uid.length; i++)
    {
        sum2 += user2.uid.charCodeAt(i)
    }
    if(sum1 === sum2)
    {
        console.error("UID HAVE IDENTICAL SUMS")
        return "IDENTICAL SUM ERROR";
    }
    return ((sum1 > sum2)? user1.uid + user2.uid : user2.uid + user1.uid)
}
interface PROPS {
    authState: Auth;
    firebaseState: FirebaseApp;
    chatWith:Record<string, attendanceUser>,
    setChatWith:Function
}
export {docSnapToAttendanceUser,attendanceUser, compareArrays, getCollectionName, PROPS}