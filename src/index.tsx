import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/compiled/index.css';
import Navbar from './navbar';
import AuthTest from './auth';
import { SignatureKind } from 'typescript';

const navbar = ReactDOM.createRoot(document.getElementById('navbar')!);
navbar.render(
    <Navbar />

);
const email = AuthTest("userInfo")?.email
const signIn = ReactDOM.createRoot(document.getElementById('signIn')!);
signIn.render(
    <p>email is {email}</p>


);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
