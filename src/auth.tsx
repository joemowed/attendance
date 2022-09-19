import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User, updateCurrentUser } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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



function AuthTest() {
    const auth = getAuth(attendancefb);
    console.log(useAuthState(auth))

    return (
        <div>
            <p>{useAuthState(auth)[0]?.email}</p>;
        </div>
}
export default AuthTest;
