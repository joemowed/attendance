import React, { useState } from 'react';

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



function AuthTest(request: string) {
    const auth = getAuth(attendancefb);
    let userUpdater = {
        uid: "udf",
        displayName: "udf",
        photoURL: "udf",
        email: "udf",
        phoneNumber: "udf",
        emailVerified: false,



    };
    const [myUser, setMyUser] = useState(userUpdater);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            userUpdater.uid! = user.uid!;
            userUpdater.emailVerified! = user.emailVerified!;
            userUpdater.displayName! = user.displayName!;
            userUpdater.phoneNumber! = user.phoneNumber!;
            userUpdater.email! = user.email!;
            userUpdater.photoURL! = user.photoURL!;


            setMyUser(userUpdater);
            console.log(myUser);
            // ...
        } else {
            console.log("no user login");

        }



    });
    if (request === "userInfo") {
        return myUser;
    }

}
export default AuthTest;
