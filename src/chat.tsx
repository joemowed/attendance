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
    getDoc,
    Firestore,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth"
import { Auth, getAuth, signOut } from "firebase/auth";
import ReactDOM from "react-dom";
import { cp } from "fs";
import { useCollection } from "react-firebase-hooks/firestore"
import { attendanceUser, compareArrays, docSnapToAttendanceUser, getCollectionName } from "./chatRoomHelpers";
import { arrayBuffer } from "stream/consumers";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
let namesQuery = [] as string[];
let chattingWith = "0000000000000000000000000000";
function SIGNOUT(auth: Auth) {


    signOut(auth);
}

function displayMessage(
    messageJSON: QueryDocumentSnapshot<DocumentData>,
    readerId: string,
    ident: string | attendanceUser
) {
    const trueOnSent = (readerId === Object.keys(messageJSON.data())[0]);
    const unix = messageJSON.id;
    const message = Object.values(messageJSON.data())[0];
    const millis = Number(unix);
    const dateObj = new Date(millis);
    const dateArr = dateObj.toLocaleString().split(",");
    const time = dateArr[1].slice(0, 5) + dateArr[1].slice(8, 11);
    const name = (typeof ident === "string") ? ident : ident.displayName;
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
                <div className="mt-4 break-words max-w-[40%] ml-[3%] min-w-[20%] bg-teal-400/20 border-2 min-h-[5rem] rounded  border-teal-400 relative rounded-bl-[1.9rem] left-0">
                    <p className="border-teal-400 border-b-2 p-1 pl-5">{message}</p>
                    <div className="grid grid-cols-3 grid-rows-1 h-full w-full">
                        <img className="max-h-full max-w-full min-h-[2.79rem] mt-auto mr-auto aspect-square h-14  rounded-full" alt="" crossOrigin="anonymous" src={(typeof ident === "string") ? "https://firebasestorage.googleapis.com/v0/b/attandacefb.appspot.com/o/profileimages%2Fdefault.png?alt=media&token=ad5de4b3-83c9-418f-89c3-996644257cec" : ident.photoURL} />
                        <p onClick={() => { chattingWith = (ident as attendanceUser).uid; console.log(chattingWith) }} className="hover:bg-teal-400/20 active:bg-teal-400/50 select-none h-[90%] w-[90%] m-auto text-center p-2 italic font-thin text-sm text-gray-500 border-2 rounded-2xl border-teal-600">Private <br />Message</p>
                        <p className="mt-1 pr-5 text-right">{name}</p>
                    </div>
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
function postMessage(uid: string, msgContent: string, dataBaseRoot: Firestore) {
    if (!msgContent) {
        return;
    }
    const timeStamp = JSON.stringify(Date.now());
    setDoc(doc(dataBaseRoot, "JJCHATS", timeStamp), { [uid]: msgContent });
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
function changeChatting() {

}
//@ts-ignore

function Chatapp(props: PROPS) {
    const dataBaseRoot = getFirestore(props.firebaseState)
    const [currMsg, setCurrMsg] = useState("");
    const [chattingWith, setChattingWith] = useState("0000000000000000000000000000")
    const [autoScroll, setAutoScroll] = useState(true);
    const [usernames, setUsernames] = useState({} as Record<string, attendanceUser>);
    const [chats, setChats] = useState([<p>LOADING...</p>])
    const user = useAuthState(props.authState)[0];
    const [messagesRoot, setMessagesRoot] = useState(collection(dataBaseRoot, "JJCHATS"))
    const dbListener = useCollection(messagesRoot);

    useEffect(() => {
        if (chattingWith === "0000000000000000000000000000") {
            setMessagesRoot(collection(dataBaseRoot, "JJCHATS"))
            console.log("JJCHATS")
        }
        else {
            setMessagesRoot(collection(dataBaseRoot, getCollectionName(user!, usernames![chattingWith])))
            console.log(getCollectionName(user!, usernames![chattingWith]))
        }
    }, [)
    console.log(chattingWith)
    useEffect(() => {
        if (!dbListener[1]) {
            const arr = dbListener[0]!?.docs.map((messageJSON) => {
                const senderID = Object.keys(messageJSON.data())[0];

                const name = (usernames[senderID]?.displayName) ? usernames[senderID]?.displayName : "unknown user";

                if (name === "unknown user") {
                    if (!namesQuery.includes(senderID)) {
                        namesQuery.push(senderID);
                        console.log(namesQuery)
                    }
                    return (displayMessage(messageJSON, user!.uid, name));
                }


                return (displayMessage(messageJSON, user!.uid, usernames[senderID]));
            })
            setChats(arr);
        }
    }, [dbListener[0]?.docs.length, Object.keys(usernames).length])
    useEffect(() => {
        namesQuery.forEach((uid) => {
            getDoc(doc(dataBaseRoot, 'USERINFO', uid))
                .then((snap) => {
                    const updaterObject = { ...usernames, ...{ [snap.id]: docSnapToAttendanceUser(snap) } }
                    setUsernames(updaterObject);
                    console.log(snap.id)
                })
                .catch((err) => console.error(err))
            namesQuery = namesQuery.filter(name => name !== uid)
        })
    }, [namesQuery.length])
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
                {chats}
            </div>
            <div className="grid mb-5 gap-y-[3%] row-span-1 grid-rows-3 grid-cols-1">
                <div className=" border-teal-400 border-t-4   w-full   grid grid-cols-3 grid-rows-1">
                    <input
                        autoFocus={true}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (user!.uid) {
                                    postMessage(user!.uid!, currMsg!, dataBaseRoot);
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
                                postMessage(user!.uid!, currMsg!, dataBaseRoot);
                            }
                            setCurrMsg("");
                        }}
                        className="bg-transparent select-none border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80 align-middle rounded-2xl  h-full text-center text-xl  font-bold font-mono text-clip"
                    >
                        send msg
                    </p>
                </div>
                <p
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={
                        (autoScroll! ? "bg-teal-400" : "bg-transparent") +
                        "  select-none border-4 border-teal-500  hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-full text-center text-xl  font-bold font-mono text-clip"
                    }
                >
                    Autoscroll
                </p>
                <p
                    onClick={() => SIGNOUT(props.authState)}
                    className="  select-none bg-transparent border-4 border-teal-500 hover:bg-teal-400 hover:opacity-100 opacity-80 active:opacity-80  rounded-2xl m-2 h-full text-center text-xl  font-bold font-mono text-clip"
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
