import './style/compiled/chat.css';
import React, { useEffect, useRef, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactDOM from 'react-dom';
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

function displayMessage(message: string, trueOnSent: boolean, sender: string, unix: string) {
    const millis = Number(unix);
    const dateObj = new Date(millis);
    const dateArr = dateObj.toLocaleString().split(',')
    const time = dateArr[1].slice(0, 5) + dateArr[1].slice(8, 11);


    if (trueOnSent) {
        return (
            <div>
                <div className='mt-4 break-words max-w-[40%] min-w-[20%] bg-teal-400/20 border-2 min-h-[5rem]  ml-auto w-fit border-teal-400 rounded relative right-0' >
                    <p className='border-teal-400 border-b-2 p-1 pl-5'>{message}</p>
                    <p className='mt-1 pl-5'>me</p>
                </div>
                <p className='w-fit ml-auto mr-4 relative right-0 italic text-gray-500 text-sm '>{time}<br />{dateArr[0]}</p>
            </div >
        );
    }
    else {
        return (
            <div>
                <div className='mt-4 break-words max-w-[40%] min-w-[20%] bg-teal-400/20 border-2 min-h-[5rem] rounded  border-teal-400 relative left-0'>
                    <p className='border-teal-400 border-b-2 p-1 pl-5'>{message}</p>
                    <p className='mt-1 pr-5 text-right'>{sender}</p>
                </div>
                <p className='w-fit mr-auto ml-4 relative left-0 italic text-gray-500 text-sm '>{time}<br />{dateArr[0]}</p>
            </div >
        );
    }
}
function postMessage(name: string, msgContent: string) {
    if (!msgContent) { return; }
    const timeStamp = JSON.stringify(Date.now());
    setDoc(doc(dataBaseRoot, "JJCHATS", timeStamp), { [name]: msgContent })

}
function autoScroller(autoScroll: boolean, ref: React.RefObject<HTMLDivElement>) {

    if (autoScroll) {
        ref!.current!.scrollTo({ top: 100000, left: 0, behavior: 'smooth' })
        console.log("scrolling")
    }
    else {
        console.log("noTTTscrolling")
    }
}
//@ts-ignore

function Chatapp(props) {
    const [currMsg, setCurrMsg] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
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

            return (displayMessage(Object.values(docObj!.data())[0], iSentOnTrue, Object.keys(docObj!.data())[0], docObj!.id));
        });
        arrR = arr;

    }

    console.log(autoScroll!);
    const messageBox = useRef<HTMLDivElement>(null);
    useEffect(() => autoScroller(autoScroll, messageBox));





    // messageDocs.map((message))
    // console.log(messageDocs[0].data().msg)
    return (
        <div className='absolute -translate-x-1/2 top-0 left-[50%] -z-50 py-24 bg-teal-400/20 h-full w-[50rem] mb-10 '>
            <div ref={messageBox} className='h-4/5 pb-4 overflow-y-scroll '>
                {arrR!}
            </div>
            <div className='relative mt-8  border-teal-400 border-t-4 pt-2   w-full  mb-16 grid grid-cols-3 grid-rows-1'>
                <input autoFocus={true
                } onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (user!.uid) {
                            postMessage(user!.displayName!, currMsg!)
                        }
                        setCurrMsg('');
                    }
                }} className='bg-teal-400/20 col-span-2 border-teal-400 hover:bg-teal-400/70 w-[2/3] h-full rounded' title='currentMessage' type='text' value={currMsg} onChange={(updatedText) => setCurrMsg(updatedText.target.value)} />
                <p
                    onClick={() => {
                        if (user!.uid) {
                            postMessage(user!.displayName!, currMsg!)
                        }
                        setCurrMsg('');
                    }} className='bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80 w-24 rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'>send msg</p>



            </div>
            <p onClick={() => setAutoScroll(!autoScroll)} className={((autoScroll!) ? 'bg-teal-400' : 'bg-transparent') + ' absolute  -translate-x-1/2 w-[90%] left-[50%] bottom-[8%]   border-4 border-teal-500  hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'}>Autoscroll</p>
            <p onClick={SIGNOUT} className='absolute  -translate-x-1/2 w-[90%] left-[50%] bottom-[2.5%]  bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-14 text-center text-xl pt-2.5 font-bold font-mono text-clip'>sign out</p>
        </div >
    );
}
export default Chatapp;