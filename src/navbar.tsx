
import './style/compiled/navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import { Auth, User } from 'firebase/auth';
import { collection, doc, DocumentData, DocumentSnapshot, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { get } from 'https';
import { FirebaseApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { attendanceUser, docSnapToAttendanceUser, PROPS } from './chatRoomHelpers';
let storageRoot;
let dataBaseRoot: Firestore;
let user: User | null | undefined;
let profileSrc = "https://firebasestorage.googleapis.com/v0/b/attandacefb.appspot.com/o/profileimages%2Fdefault.png?alt=media&token=ad5de4b3-83c9-418f-89c3-996644257cec";


function Navbar(props: PROPS) {

  const [attendanceUserInfo, setAttendanceUserInfo] = useState({} as attendanceUser);
  const image = useRef(null);
  user = props.authState.currentUser;
  //useEffect to run once on load
  useEffect(() => {
    dataBaseRoot = getFirestore(props.firebaseState);
    storageRoot = getStorage(props.firebaseState);
    console.log("getting info")
    getDoc(doc(dataBaseRoot, 'USERINFO', user!.uid))

      .then((snap) => {//@ts-ignore
        console.log("info received")
        setAttendanceUserInfo(docSnapToAttendanceUser(snap))

        console.log(attendanceUserInfo.photoURL)

      })
      .catch((error) => console.error("ERROR: could not load attendanceUserinfo", error)
      )


  }, []);
  return (
    <div className="  h-full  w-full overflow-clip grid grid-rows-1 grid-cols-[90%10%] bg-teal-500/80 text-white text-5xl font-light   font-mono rounded-b-xl">

      <p>{attendanceUserInfo.email}</p>
      <img ref={image} className=" max-h-full max-w-full my-auto p-[3%] aspect-square  rounded-full " src={(attendanceUserInfo.photoURL) ? attendanceUserInfo.photoURL : profileSrc} alt="" />
    </div>
  );
}

export default Navbar;
