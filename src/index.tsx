import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './navbar';

const navbar = ReactDOM.createRoot(document.getElementById('navbar')!);
navbar.render(
    <Navbar />
    
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
