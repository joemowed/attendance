import "./style/compiled/chat.css";
import React, { useEffect, useRef, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getFirestore,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Auth, getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactDOM from "react-dom";
import { cp } from "fs";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC94BhdLTjxbWDNDpu1fIvYb2Jpz1QgJME",
    authDomain: "attandacefb.firebaseapp.com",
    projectId: "attandacefb",
    storageBucket: "attandacefb.appspot.com",
    messagingSenderId: "141677825763",
    appId: "1:141677825763:web:5e938f73772539b226ffd6",
    measurementId: "G-CBP7M8C68T",
};

// Initialize Firebase
const attendancefb = initializeApp(firebaseConfig);
const dataBaseRoot = getFirestore(attendancefb);
function SIGNOUT() {
    const auth = getAuth(attendancefb);

    signOut(auth);
}

function displayMessage(
    message: string,
    trueOnSent: boolean,
    unix: string,
    name: string
) {
    const millis = Number(unix);
    const dateObj = new Date(millis);
    const dateArr = dateObj.toLocaleString().split(",");
    const time = dateArr[1].slice(0, 5) + dateArr[1].slice(8, 11);

    if (trueOnSent) {
        return (
            <div key={unix}>
                <div className="mt-4 break-words max-w-[40%] mr-[3%] min-w-[20%] bg-teal-400/20 border-2 min-h-[5rem]  ml-auto w-fit border-teal-400 rounded relative right-0">
                    <p className="border-teal-400 border-b-2 p-1 pl-5">{message}</p>
                    <p className="mt-1 pl-5">me</p>
                </div>
                <p className="w-fit ml-auto mr-4 relative right-0 italic text-gray-500 text-sm ">
                    {time}
                    <br />
                    {dateArr[0]}
                </p>
            </div>
        );
    } else {
        return (
            <div key={unix}>
                <div className="mt-4 break-words max-w-[40%] ml-[3%] min-w-[20%] bg-teal-400/20 border-2 min-h-[5rem] rounded  border-teal-400 relative left-0">
                    <p className="border-teal-400 border-b-2 p-1 pl-5">{message}</p>
                    <p className="mt-1 pr-5 text-right">{name}</p>
                </div>
                <p className="w-fit mr-auto ml-4 relative left-0 italic text-gray-500 text-sm ">
                    {time}
                    <br />
                    {dateArr[0]}
                </p>
            </div>
        );
    }
}
function postMessage(uid: string, msgContent: string) {
    if (!msgContent) {
        return;
    }
    const timeStamp = JSON.stringify(Date.now());
    setDoc(doc(dataBaseRoot, "JJCHATS", timeStamp), { [uid]: msgContent });
}

function getUidFromName(uid: string) {
    return fetch("https://attandacefb.web.app/uidToName", {
        method: "POST",
        body: uid,
    });
}
function autoScroller(
    autoScroll: boolean,
    ref: React.RefObject<HTMLDivElement>
) {
    if (autoScroll) {
        ref!.current!.scrollTo({ top: 100000, left: 0, behavior: "smooth" });
    } else {
    }
}
//@ts-ignore

function Chatapp(props: PROPS) {
    const [currMsg, setCurrMsg] = useState("");
    const [autoScroll, setAutoScroll] = useState(true);
    const [uidToName, setUidToName] = useState({} as Record<string, string>);
    const user = useAuthState(props.authState)[0];
    const messagesRoot = collection(dataBaseRoot, "JJCHATS");
    const dbListener = useCollection(messagesRoot);
    //@ts-ignore
    let messageDocs;
    let arrR = [<p>LOADING...</p>];
    let arr = [<p>LOADING...</p>];
    //  console.log(arr);
    if (!dbListener[1]) {
        messageDocs = dbListener[0]?.docs; //returns an array of all documents
        // console.log(Object.values(messageDocs![0].data()));
        //@ts-ignore
        arr = messageDocs!.map((docObj, indexOfDoc) => {
            const senderId: string = Object.keys(docObj.data())[0];
            const iSentOnTrue: boolean = senderId === user!.uid;

            console.log(`value: ${uidToName[senderId]}`)
            console.log(`fetch: ${!uidToName[senderId]}`)
            if (!uidToName[senderId]) {
                console.log("fetching")
                let dName: string;

                const fetchPromise = fetch("https://attandacefb.web.app/uidToName", {
                    method: "POST",
                    body: senderId,
                })
                const gotText = fetchPromise.then((response) => { return response.text() }, (err) => console.error("cant read response", err))
                gotText.then((name) => {
                    const updatedNames = { ...uidToName, ... { [senderId]: name! } };

                    setUidToName(updatedNames);

                }, (err) => console.error('Response OK, cant read text', err))




                // console.log(mergedNames)

                const updatedNames = { ...uidToName, ...{ [senderId]: "unknown user" } };

                setUidToName(updatedNames);
                return <div></div>;
            }


            return displayMessage(
                Object.values(docObj!.data())[0],
                iSentOnTrue,
                docObj!.id,
                uidToName[senderId]
            );
        });
        arrR = arr;
    }

    const messageBox = useRef<HTMLDivElement>(null);
    useEffect(() => autoScroller(autoScroll, messageBox));

    // messageDocs.map((message))
    // console.log(messageDocs[0].data().msg)
    return (
        <div className="grid grid-cols-1 grid-rows-5 -z-50  bg-teal-400/20 h-full w-[1/2]">
            <div
                ref={messageBox}
                className="h-full row-span-4 pb-4 overflow-y-scroll "
            >
                {arrR!}
            </div>
            <div className="grid mb-5 gap-y-[3%] row-span-1 grid-rows-3 grid-cols-1">
                <div className=" border-teal-400 border-t-4   w-full   grid grid-cols-3 grid-rows-1">
                    <input
                        autoFocus={true}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (user!.uid) {
                                    postMessage(user!.uid!, currMsg!);
                                }
                                setCurrMsg("");
                            }
                        }}
                        className="bg-teal-400/20 col-span-2 border-teal-400 hover:bg-teal-400/70 w-full h-full rounded"
                        title="currentMessage"
                        type="text"
                        value={currMsg}
                        onChange={(updatedText) => setCurrMsg(updatedText.target.value)}
                    />
                    <p
                        onClick={() => {
                            if (user!.uid) {
                                postMessage(user!.uid!, currMsg!);
                            }
                            setCurrMsg("");
                        }}
                        className="bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80 align-middle rounded-2xl  h-full text-center text-xl  font-bold font-mono text-clip"
                    >
                        send msg
                    </p>
                </div>
                <p
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={
                        (autoScroll! ? "bg-teal-400" : "bg-transparent") +
                        "   border-4 border-teal-500  hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-full text-center text-xl  font-bold font-mono text-clip"
                    }
                >
                    Autoscroll
                </p>
                <p
                    onClick={SIGNOUT}
                    className="  bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-full text-center text-xl  font-bold font-mono text-clip"
                >
                    sign out
                </p>
            </div>
        </div>
    );
}

interface PROPS {
    authState: Auth;
    firebaseState: FirebaseApp;
}
export default Chatapp;
