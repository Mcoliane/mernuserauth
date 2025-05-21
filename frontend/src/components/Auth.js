import React, { useState } from "react";
import {
    auth,
    googleProvider
} from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { Tabs, Tab, Card, CardBody, Form, Input, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    const [tab, setTab] = useState("login");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [popup, setPopup] = useState({ show: false, success: true });
    const API_BASE = "http://localhost:5001";
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showPopup = (msg, success = true) => {
        setMessage(msg);
        setPopup({ show: true, success });
        setTimeout(() => setPopup({ show: false, success: true }), 2500);
    };

    const signUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await fetch(`${API_BASE}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, username: formData.username, email: formData.email })
            });
            showPopup("Registration successful!");
            setTab("login");
        } catch (err) {
            console.error("Signup error:", err);
            showPopup("Registration failed.", false);
        }
    };

    const signIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            showPopup("Login successful!");
            setTimeout(() => navigate("/"), 1000); // Give popup time to show
        } catch (err) {
            console.error("Signin error:", err);
            showPopup("Login failed.", false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { isNewUser } = result._tokenResponse || {};
            const user = result.user;

            if (isNewUser) {
                const googleUsername = user.displayName || user.email.split("@")[0];
                await fetch(`${API_BASE}/api/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.uid, username: googleUsername, email: user.email })
                });
            }

            showPopup("Signed in with Google!");
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            console.error("Google sign-in error:", err);
            showPopup("Google sign-in failed.", false);
        }
    };



    return (
        <main className="flex min-w-screen min-h-screen">
            <div className="flex min-h-screen w-full">
                <div className="flex w-fit md:w-1/3 items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-[#110613] text-white">
                    <div className="w-full max-w-md">
                        <Card className="w-[340px] h-[600px] flex flex-col">
                            <Tabs
                                selectedKey={tab}
                                onSelectionChange={setTab}
                                fullWidth
                                classNames={{
                                    tabList: "flex w-full justify-center px-2 py-1 space-x-2",
                                    tab: "flex-1 rounded-md py-2 text-sm font-semibold text-white text-center transition-all duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 data-[selected=true]:bg-yellow-500 data-[selected=true]:text-black shadow-sm",
                                }}
                            >
                                <Tab key="login" title="Login" />
                                <Tab key="signup" title="Sign Up" />
                            </Tabs>
                            <CardBody className="flex-1 overflow-auto px-4 py-6">
                                <div className="mt-4 min-h-[400px]">
                                    {tab === "login" ? (
                                        <Form onSubmit={signIn} className="flex flex-col gap-4">
                                            <label className="text-sm text-gray-300">Email</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                            />
                                            <label className="text-sm text-gray-300">Password</label>
                                            <Input
                                                type="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                            />
                                            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition">Login</Button>
                                            <Button onPress={signInWithGoogle} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow transition">Sign in with Google</Button>
                                        </Form>
                                    ) : (
                                        <Form onSubmit={signUp} className="flex flex-col gap-4">
                                            <label className="text-sm text-gray-300">Username</label>
                                            <Input
                                                type="text"
                                                name="username"
                                                placeholder="Enter your username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                            />
                                            <label className="text-sm text-gray-300">Email</label>
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                            />
                                            <label className="text-sm text-gray-300">Password</label>
                                            <Input
                                                type="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                            />
                                            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition">Sign Up</Button>
                                        </Form>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <div className="w-2/3 h-full bg-cover bg-center bg-chess-login" />
            </div>

            {/* Feedback Popup */}
            {popup.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-sm shadow-2xl text-white relative">
                        <h2 className={`text-xl font-bold ${popup.success ? 'text-green-500' : 'text-red-500'}`}>
                            {popup.success ? 'Success' : 'Error'}
                        </h2>
                        <p className="text-gray-300 mt-4">{message}</p>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Auth;
