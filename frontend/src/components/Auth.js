import React, { useState } from 'react';
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fef7ff',
        fontFamily: 'Roboto, Arial, sans-serif',
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
    };

    const inputStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    };

    const buttonStyle = {
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const containedButton = {
        ...buttonStyle,
        backgroundColor: '#6750a4',
        color: '#ffffff',
    };

    const outlinedButton = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        color: '#6750a4',
        border: '2px solid #6750a4',
    };

    const textButton = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        color: '#b3261e',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <input
                    style={inputStyle}
                    placeholder="Email..."
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={inputStyle}
                    placeholder="Password..."
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <button style={containedButton} onClick={signIn}>Sign in</button>
                <button style={outlinedButton} onClick={signInWithGoogle}>Sign In With Google</button>
                <button style={textButton} onClick={logOut}>Logout</button>
            </div>
        </div>
    );
};

export default Auth;
