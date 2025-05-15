import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const API_BASE = "http://localhost:5001";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    const showAlert = (message) => {
        window.alert(message);
    };

    const validateFields = () => {
        if (!email.trim() || !password.trim()) {
            showAlert("Email and password are required.");
            return false;
        }
        return true;
    };

    const signUp = async () => {
        if (!validateFields() || !username.trim()) {
            showAlert("All fields are required to sign up.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await fetch(`${API_BASE}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, username, email })
            });
            showAlert("Account created successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error("Signup error:", err);
            showAlert("Failed to create account: " + err.message);
        }
    };

    const signIn = async () => {
        if (!validateFields()) return;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showAlert("Signed in successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error("Signin error:", err);
            showAlert("Failed to sign in: " + err.message);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { isNewUser } = result._tokenResponse || {};
            if (isNewUser) {
                const user = result.user;
                const googleUsername = user.displayName || user.email.split("@")[0] || "Unnamed";
                await fetch(`${API_BASE}/api/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.uid, username: googleUsername, email: user.email })
                });
            }
            showAlert("Signed in with Google successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error("Google sign-in error:", err);
            showAlert("Google sign-in failed: " + err.message);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            showAlert("Logged out successfully.");
        } catch (err) {
            console.error("Logout error:", err);
            showAlert("Logout failed: " + err.message);
        }
    };

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#fef7ff",
        fontFamily: "Roboto, Arial, sans-serif",
        padding: "2rem"
    };

    const cardStyle = {
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    };

    const inputStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
        outline: "none"
    };

    const buttonStyle = {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
    };

    const containedButton = {
        ...buttonStyle,
        backgroundColor: "#6750a4",
        color: "#ffffff"
    };

    const outlinedButton = {
        ...buttonStyle,
        backgroundColor: "transparent",
        color: "#6750a4",
        border: "2px solid #6750a4"
    };

    const textButton = {
        ...buttonStyle,
        backgroundColor: "transparent",
        color: "#b3261e"
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {!isLoggedIn && (
                    <>
                        <input
                            style={inputStyle}
                            placeholder="Username..."
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Email..."
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Password..."
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button style={containedButton} onClick={signUp}>Sign Up</button>
                        <button style={outlinedButton} onClick={signIn}>Sign In</button>
                        <button style={outlinedButton} onClick={signInWithGoogle}>Sign In With Google</button>
                    </>
                )}
                {isLoggedIn && (
                    <button style={textButton} onClick={logOut}>Logout</button>
                )}
            </div>
        </div>
    );
};

export default Auth;
