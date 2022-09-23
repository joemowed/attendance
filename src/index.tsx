import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './style/compiled/index.css';
import Navbar from './navbar';
import AuthTest from './auth';

import Chatapp from './chat';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Test from './test';
import NavbarAnonymous from './navbarAnonymous';
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
const auth = getAuth(attendancefb);
let uid: String | null | undefined = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        const chat = ReactDOM.createRoot(document.getElementById('chat')!);
        const navbar = ReactDOM.createRoot(document.getElementById('navbar')!)
        navbar.render(
            <Navbar authState={auth} firebaseState={attendancefb} />
        );
        chat.render(

            <StrictMode>



                <Chatapp firebaseState={attendancefb} authState={auth} />
            </StrictMode>





        );


        // ...
    }
    else {
        // User is signed out
        // ...
        // uid = null;  
        const signIn = ReactDOM.createRoot(document.getElementById('signIn')!);
        signIn.render(
            <div className='h-full w-full'>
                <NavbarAnonymous />

                <AuthTest />
            </div>
        );
    }






});



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
