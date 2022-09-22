
import './style/compiled/navbar.css';
import React, { useEffect } from 'react';
import { Auth, User } from 'firebase/auth';
import { collection, doc, DocumentData, DocumentSnapshot, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { get } from 'https';


let dataBaseRoot: Firestore;
let user: User | null | undefined;


//@ts-ignore
function Navbar(props) {
  dataBaseRoot = getFirestore(props.firebaseState)
  user = useAuthState(props.authState)[0];
  return (
    <div className="navbar grid grid-cols-[90%10%] h-full col-span-1 w-full overflow-clip  bg-teal-500/80 text-white text-5xl font-light items-center  font-mono rounded-b-xl">

      <p>some content</p>
      <img src={"dsad"} alt="" />
    </div>
  );
}

export default Navbar;
