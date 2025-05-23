import React, { useState, useEffect } from 'react';
import { auth } from "../config/firebase";
import { onAuthStateChanged, updatePassword, signOut } from "firebase/auth";

import {getDatabase, onValue, ref, update} from "firebase/database";
import {
    Tabs, Tab, Input, Button, Divider, Form
} from '@heroui/react';
import avatar1 from './avatars/avatar1.png';
import avatar2 from './avatars/avatar2.png';
import avatar3 from './avatars/avatar3.png';
import avatar4 from './avatars/avatar4.png';
import avatar5 from './avatars/avatar5.png';

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('profile');
    const [formData, setFormData] = useState({ name: '', email: '', bio: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [message, setMessage] = useState("");
    const [popup, setPopup] = useState({show: false, success: true});
    const avatarMap = {
        'avatar1.png': avatar1,
        'avatar2.png': avatar2,
        'avatar3.png': avatar3,
        'avatar4.png': avatar4,
        'avatar5.png': avatar5,
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);

                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();

                    const usernameFromDb = data?.username || null;
                    const avatarFromDb = data?.avatar || 'avatar1.png';

                    const resolvedName = user.displayName || usernameFromDb || 'Anonymous';

                    const basicUser = {
                        name: resolvedName,
                        email: user.email || '',
                        avatar: avatarFromDb,
                        uid: user.uid,
                    };

                    setCurrentUser({
                        ...basicUser,
                        bio: data?.bio || '',
                        rating: data?.stats?.rating || 1200,
                        rd: data?.stats?.rd || 350,
                        gamesPlayed: data?.stats?.gamesPlayed || 0,
                    });

                    setFormData({
                        name: resolvedName,
                        email: user.email || '',
                        bio: data?.bio || '',
                        avatar: avatarFromDb,
                    });
                });
            }
        });

        return () => unsubscribe();
    }, []);

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <p>Loading user profile...</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const showPopup = (msg, success = true) => {
        setMessage(msg);
        setPopup({show: true, success});
        setTimeout(() => setPopup({show: false, success: true}), 2500);
    };
    const handleSave = async () => {
        try {
            const db = getDatabase();
            const userRef = ref(db, `users/${currentUser.uid}`);

            await update(userRef, {
                bio: formData.bio,
                avatar: formData.avatar,  // Save avatar filename here
            });

            setPasswordMessage("Profile updated.");
            setIsEditing(false);

            setCurrentUser((prev) => ({
                ...prev,
                bio: formData.bio,
                name: formData.name,
                avatar: formData.avatar,  // Update avatar in state
            }));
            showPopup("Profile changes saved", true);
        } catch (error) {
            console.error("Error saving profile:", error);
            showPopup("Unable to save profile", false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage("Passwords do not match.");
            return;
        }

        try {
            await updatePassword(auth.currentUser, newPassword);
            setPasswordMessage("Password updated successfully.");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordMessage("Failed to update password. Please re-authenticate and try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login"; // Redirect after logout
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="min-w-screen min-h-screen md:w-3/4 lg:w-2/3 bg-gradient-to-br from-[#253C3F] to-black text-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-6 mb-6">
                    <img
                        src={avatarMap[currentUser.avatar]}
                        alt="User avatar"
                        className="w-20 h-20 rounded-full"
                    />

                    <div>
                        <h2 className="text-3xl font-semibold">{currentUser.name}</h2>
                        <p className="text-gray-400">{currentUser.email}</p>
                    </div>
                </div>

                <Divider className="my-4 border-gray-700"/>

                <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                    fullWidth
                    classNames={{
                        tabList: "flex w-full justify-center px-2 py-1 space-x-2",
                        cursor: "bg-yellow-500 bg-radius-5",
                        tab: "flex-1 rounded-md py-2 text-sm font-semibold text-white text-center transition-all duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 data-[selected=true]:bg-yellow-500 data-[selected=true]:text-black shadow-sm",
                        tabContent: "group-data-[selected=true]:text-white ",
                    }}
                >
                    <Tab key="profile" title="Profile" />
                    <Tab key="stats" title="Game Stats" />
                    <Tab key="settings" title="Settings" />
                </Tabs>

                <div className="mt-6">
                    {selectedTab === 'profile' && (!isEditing ? (
                        <div className="space-y-4">
                            <p><span className="font-semibold">Name:</span> {formData.name}</p>
                            <p><span className="font-semibold">Email:</span> {formData.email}</p>
                            <p><span className="font-semibold">Bio:</span> {formData.bio}</p>
                            <Button
                                color="primary"
                                onPress={() => setIsEditing(true)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    ) : (
                        <Form className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                {Object.entries(avatarMap).map(([fileName, avatarSrc], index) => (
                                    <img
                                        key={index}
                                        src={avatarSrc}
                                        alt={`avatar ${index + 1}`}
                                        onClick={() => setFormData({ ...formData, avatar: fileName })}
                                        className={`w-20 h-20 rounded-full border-4 cursor-pointer ${
                                            formData.avatar === fileName ? "border-yellow-500" : "border-transparent"
                                        }`}
                                    />
                                ))}

                            </div>
                            <label>Name</label>
                            <Input
                                name="name"
                                value={formData.name}
                                readOnly
                                className="bg-gray-800 text-white border border-gray-600 rounded-md opacity-50 cursor-not-allowed"
                            />
                            <label>Email</label>
                            <Input
                                name="email"
                                value={formData.email}
                                readOnly
                                className="bg-gray-800 text-white border border-gray-600 rounded-md opacity-50 cursor-not-allowed"
                            />
                            <label>Bio</label>
                            <Input
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    color="success"
                                    onPress={handleSave}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                                >
                                    Save
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => setIsEditing(false)}
                                    className="bg-red-500 hover:bg-red-600 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                                >
                                    Cancel
                                </Button>
                            </div>
                            {popup.show && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                                    <div
                                        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-sm shadow-2xl text-white relative">
                                        <h2 className={`text-xl font-bold ${popup.success ? 'text-green-500' : 'text-red-500'}`}>
                                            {popup.success ? 'Success' : 'Error'}
                                        </h2>
                                        <p className="text-gray-300 mt-4">{message}</p>
                                    </div>
                                </div>)}
                        </Form>
                    ))}

                    {selectedTab === 'stats' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Chess Stats</h3>
                            <p><span className="font-medium">Rating:</span> {currentUser.rating}</p>
                            <p><span className="font-medium">Games Played:</span> {currentUser.gamesPlayed}</p>
                        </div>
                    )}

                    {selectedTab === 'settings' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Settings</h3>
                            <p className="text-gray-400">Update your password below.</p>
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                            />
                            <Input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="bg-gray-800 text-white border border-gray-600 rounded-md"
                            />
                            <Button
                                color="primary"
                                onPress={handleChangePassword}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-5 rounded-lg shadow-md transition-colors duration-300 mr-4"
                            >
                                Change Password
                            </Button>

                            {passwordMessage && (
                                <p
                                    className={`mt-2 text-sm ${
                                        passwordMessage.toLowerCase().includes("successfully")
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {passwordMessage}
                                </p>
                            )}

                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-colors duration-300"
                            >
                                Log out
                            </Button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
