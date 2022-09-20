import React, { useState } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User, updateCurrentUser } from "firebase/auth";
// Import the functions you need from the SDKs you need
//@ts-ignore
import bigG from './assets/bigG.png';
import { initializeApp } from "firebase/app";
import './style/compiled/auth.css';
import userEvent from '@testing-library/user-event';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC94BhdLTjxbWDNDpu1fIvYb2Jpz1QgJME",
    authDomain: "attandacefb.firebaseapp.com",
    projectId: "attandacefb",
    storageBucket: "attandacefb.appspot.com",
    messagingSenderId: "141677825763",
    appId: "1:141677825763:web:5e938f73772539b226ffd6",
    measurementId: "G-CBP7M8C68T"
};

// Initialize Firebase
const attendancefb = initializeApp(firebaseConfig);
//@ts-ignore


function signInWithGoogle() {
    const auth = getAuth(attendancefb);
    const provider = new GoogleAuthProvider();

    console.log(signInWithRedirect(auth, provider))
}
// @ts-ignore
function SIGNOUT() {
    const auth = getAuth(attendancefb);
    console.log("signedOUt");
    signOut(auth);
}
interface userProps {
    user: User,
    loading: boolean,
}

const signInWithGoogleButton =
    (<div className='flex items-center absolute top-5 right-10'>
        <p className=''>sign in with google <br />(only currently working method)</p>
        <img src={bigG} onClick={signInWithGoogle} alt='sign in with google' className='  bg-transparent border-4 border-teal-500 hover:opacity-100 opacity-80 active:opacity-80 w-16 rounded-2xl m-2 h-16' />
    </div>);
const loginButton =
    (
        <p className='bg-transparent border-4 border-teal-500 hover:opacity-100 opacity-80 active:opacity-80 w-24 rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'>Sign In</p>
    );
function passwordHider(password: string) {
    let hiddenString = '';
    for (let i = 0; i < password.length; i++) {
        hiddenString += '●';
    }
    return hiddenString;
}
function signInText(text: string) {
    let compiledJSX = (
        <p className=' text-lg font-semibold rounded-tr-xl border-t-2 border-x-2 mt-1 border-teal-400 w-fit'>{text}</p>
    )
    return compiledJSX;
}
function AuthTest() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth(attendancefb);
    const user = useAuthState(auth)[0];
    console.log(user)
    let renderThis;
    if (user) {
        const keys = Object.keys(user!);
        const values = Object.values(user!);

        renderThis = keys.map((key) => {
            return (<li>{key + " is " + values[keys.indexOf(key)]}</li>)
        })
    }
    return (
        <div className='relative mx-20 w-auto h-52 rounded-b bg-teal-400/40'>
            {signInText("Email:")}
            <input className='h-[2.7rem] w-[13rem] border-x-[3px] border-teal-400  bg-teal-400/10 hover:bg-teal-400/30 active:bg-teal-400/30' title='uname' type='text' value={username} onChange={(updatedText) => setUsername(updatedText.target.value)} />
            {signInText("Password:")}
            <input className='bg-teal-400/10 border-x-[3px] border-teal-400 hover:bg-teal-400/30 active:bg-teal-400/30  h-[2.7rem] w-[13rem]' title='pword' type='text' value={passwordHider(password)} onChange={(updatedText) => setPassword(updatedText.target.value)} />
            {signInWithGoogleButton}
            {loginButton}
        </div>
    );
}

export default AuthTest;
