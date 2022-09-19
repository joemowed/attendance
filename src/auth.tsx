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
    (
        <img src={bigG} onClick={signInWithGoogle} alt='sign in with google' className='bg-transparent border-4 border-teal-500 hover:opacity-100 opacity-80 active:opacity-80 w-16 rounded-2xl m-2 h-16' />
    );

function AuthTest() {
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
        <div className='mx-20 w-auto h-52 rounded-b bg-teal-400/40'>
            <p>some content</p>
            {signInWithGoogleButton}
        </div>
    );
}

export default AuthTest;
