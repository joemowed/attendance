import './style/compiled/chat.css';
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
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
const dataBaseRoot = getFirestore(attendancefb);
function SIGNOUT() {
    const auth = getAuth(attendancefb);
    console.log("signedOUt");
    signOut(auth);
}
function displayMessage(message: string, trueOnSent: boolean, sender: string) {
    if (trueOnSent) {
        return (
            <div className='mt-4 bg-teal-400/20 border-2 h-16 ml-auto w-fit border-teal-400 rounded static right-0'>
                <p className='border-teal-400 border-b-2 p-1'>{message}</p>
                <p className='mt-1'>me</p>
            </div>

        );
    }
    else {
        return (
            <div className='mt-4 bg-teal-400/20 border-2 h-16 rounded w-fit border-teal-400 static left-0'>
                <p className='border-teal-400 border-b-2 p-1'>{message}</p>
                <p className='mt-1'>{sender}</p>
            </div>

        );
    }
}
function postMessage(name: string, msgContent: string) {
    const timeStamp = JSON.stringify(Date.now());
    setDoc(doc(dataBaseRoot, "JJCHATS", timeStamp), { [name]: msgContent })

}
//@ts-ignore

function Chatapp(props) {
    const [currMsg, setCurrMsg] = useState('');
    const auth = getAuth(attendancefb);
    const user = useAuthState(auth)[0];
    const messagesRoot = collection(dataBaseRoot, "JJCHATS");
    const dbListener = useCollection(messagesRoot);
    //@ts-ignore
    let messageDocs;
    let arrR = [<p>LOADING...</p>];
    let arr = [<p>LOADING...</p>];
    //  console.log(arr);
    if (!dbListener[1]) {

        messageDocs = dbListener[0]?.docs;  //returns an array of all documents
        // console.log(Object.values(messageDocs![0].data()));
        //@ts-ignore
        arr = messageDocs!.map((docObj, indexOfDoc) => {
            const iSentOnTrue = (Object.keys(docObj.data())[0] === user!.displayName);

            return (displayMessage(Object.values(docObj!.data())[0], iSentOnTrue, Object.keys(docObj!.data())[0]));
        });
        arrR = arr;
        console.log(arr);
    }





    // messageDocs.map((message))
    // console.log(messageDocs[0].data().msg)
    return (
        <div className=' relative bg-teal-400/20 h-screen w-[50rem] mx-auto mb-12'>
            <div>
                {arrR!}
            </div>
            <div className='absolute bottom-0 border-teal-400 border-t-4 pt-2  self-center w-full  mb-2 grid grid-cols-2 grid-rows-1'>
                <input className='bg-teal-400/30 border-teal-400 hover:bg-teal-400/70 w-full h-16' title='currentMessage' type='text' value={currMsg} onChange={(updatedText) => setCurrMsg(updatedText.target.value)} />
                <p onClick={() => {
                    if (user!.uid) {
                        postMessage(user!.displayName!, currMsg!)
                    }
                    setCurrMsg('');
                }} className='bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80 w-24 rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'>send msg</p>


                <p onClick={SIGNOUT} className='absolute right-0 bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80 w-24 rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'>sign out</p>

            </div>
        </div>
    );
}
export default Chatapp;