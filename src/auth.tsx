import React from 'react';

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User, updateCurrentUser } from "firebase/auth";
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



function getUserInfo() {
    let currentUser: User;
    const auth = getAuth(attendancefb);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            currentUser = user;
            console.log(currentUser);
            // ...
        } else {
            console.log(currentUser);
        }



    });
    if (currentUser!) {
        console.log("user is defined");
        return currentUser;

    }
    else {
        console.log("user is undefined");
        return;
    }
}

function AuthTest() {
    return (
        <div>
            <p onClick={signInWithGoogle}>BIG G</p>
            <p>Email is: {React.memo}</p>


        </div>
    );
}
export default AuthTest;
