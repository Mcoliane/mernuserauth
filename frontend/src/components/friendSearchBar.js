import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {auth} from "../config/firebase";

export default function FriendSearchBar() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState(null);

    const handleAddFriend = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/users/add-friend-by-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userUid: auth.currentUser.uid,
                    inviteCode: code.trim(),
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage("Friend added!");
            } else {
                setMessage(data.error || "Failed to add friend");
            }
        } catch (err) {
            setMessage("Network error");
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter friend invite code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border p-1 rounded"
            />
            <button onClick={handleAddFriend} className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded">
                Add Friend
            </button>
            {message && <p className="mt-2 p-1">{message}</p>}
        </div>
    );
}