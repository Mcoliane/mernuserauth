import React, { useState } from "react";
import {
    auth,
    googleProvider
} from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const API_BASE = "http://localhost:5001"; //import.meta.env.REACT_API_BASE ||
    // ✅ Sign up (new user)
    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Call backend to create DB record
            await fetch(`${API_BASE}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, username, email })
            });
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    // ✅ Sign in (existing user)
    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error("Signin error:", err);
        }
    };

    // ✅ Google sign-in
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
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div>
            <input
                placeholder="Username..."
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <input
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                placeholder="Password..."
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button onClick={signUp}>Sign Up</button>
            <button onClick={signIn}>Sign In</button>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
            <button onClick={logOut}>Logout</button>
        </div>
    );
};

export default Auth;
