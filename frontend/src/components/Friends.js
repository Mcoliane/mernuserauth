import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import {
    searchUserByUsername,
    sendFriendRequest,
    getIncomingRequests,
    respondToFriendRequest,
    getFriends,
} from "../config/firebaseUtils";
import { Button } from "@heroui/react";

function FriendsComponent() {
    const [searchUsername, setSearchUsername] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [incomingRequests, setIncomingRequests] = useState({});
    const [friendUsernames, setFriendUsernames] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const userUid = getAuth().currentUser?.uid;
    const db = getDatabase();

    useEffect(() => {
        if (!currentUser) return;

        if (currentUser) {
            loadRequestsAndFriends();
        }
    }, [currentUser]);

    useEffect(() => {
        if (!userUid) return;

        const friendsRef = ref(db, `users/${userUid}/friends`);

        const unsubscribe = onValue(friendsRef, async (snapshot) => {
            const friendUIDs = snapshot.val() || {};
            const promises = Object.keys(friendUIDs).map(async (uid) => {
                const usernameSnap = await get(ref(db, `users/${uid}/username`));
                return {uid, username: usernameSnap.val() || "Unknown"};
            });

            const results = await Promise.all(promises);
            const map = {};
            results.forEach(({uid, username}) => {
                map[uid] = username;
            });

            setFriendUsernames(map);
        });

        return () => unsubscribe(); // clean up listener on unmount
    }, [userUid, db]);

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                loadRequestsAndFriends(user);
            }
        });

        return () => unsubscribe();
    }, [db]);


    async function loadRequestsAndFriends(user) {
        if (!user) return;

        const incoming = await getIncomingRequests(user.uid);
        const friendUIDs = await getFriends(user.uid);

        const usernames = {};
        for (const uid of Object.keys(friendUIDs)) {
            const response = await fetch(`/api/users/${uid}`);
            const data = await response.json();
            usernames[uid] = data.username || uid;
        }


        setIncomingRequests(incoming);
        setFriendUsernames(usernames);
        
    }


    async function handleSearch() {
        const result = await searchUserByUsername(searchUsername);
        if (result) {
            setSearchResult(result);
        } else {
            setSearchResult(null);
            alert("User not found");
        }
    }

    async function handleSendRequest() {
        await sendFriendRequest(searchResult.uid, currentUser.uid, currentUser.displayName || "Anonymous");
        alert("Friend request sent!");
        setSearchResult(null);
    }

    async function handleRespond(fromUid, accept) {
        await respondToFriendRequest(currentUser.uid, fromUid, accept);
        await loadRequestsAndFriends(currentUser);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
            <div className="max-w-3xl mx-auto space-y-10">

                {/* 🔍 Search */}
                <div className="bg-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold mb-4">🔍 Find a Player</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                        <input
                            type="text"
                            placeholder="Search by username"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                        />
                        <Button
                            onPress={handleSearch}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow transition duration-300"
                        >
                            Search
                        </Button>
                    </div>
                </div>

                {/* 📋 Search Result */}
                {searchResult && (
                    <div className="bg-white/10 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Found Player:</h3>
                        <p className="mb-2">👤 {searchResult.username}</p>
                        <Button
                            onPress={handleSendRequest}
                            className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-full"
                        >
                            ➕ Send Friend Request
                        </Button>
                    </div>
                )}

                {/* 📥 Incoming Friend Requests */}
                <div className="bg-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold mb-4">📥 Incoming Friend Requests</h2>
                    {Object.keys(incomingRequests).length === 0 ? (
                        <p className="text-gray-400">No requests</p>
                    ) : (
                        Object.entries(incomingRequests).map(([uid, username]) => (
                            <div key={uid}
                                 className="flex items-center justify-between bg-white/10 p-4 rounded-lg mb-2">
                                <p>👤 {username}</p>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => handleRespond(uid, true)}
                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        ✅ Accept
                                    </Button>
                                    <Button
                                        onPress={() => handleRespond(uid, false)}
                                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        ❌ Decline
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 🤝 Friends List */}
                <div className="bg-white/5 rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold mb-4">🤝 Your Friends</h2>
                    {Object.keys(friendUsernames).length === 0 ? (
                        <p className="text-gray-400">No friends yet</p>
                    ) : (
                        <ul className="space-y-2">
                            {Object.entries(friendUsernames).map(([uid, username]) => (
                                <li key={uid} className="bg-white/10 p-3 rounded-lg">
                                    👤 {username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
export default FriendsComponent;
