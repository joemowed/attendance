import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import React from 'react';

interface PROPS {
    authState?: Auth;
    firebaseState?: FirebaseApp;
}
export default function Test(props: PROPS) {
    console.log(props.authState)
    return (<p>{props.authState?.currentUser?.email}</p>)
}