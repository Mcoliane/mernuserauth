const BASE_URL = "http://localhost:5001/api/friends";

export async function searchUserByUsername(username) {
    const res = await fetch(`${BASE_URL}/search/${username}`);
    if (!res.ok) return null;
    return await res.json();
}

export async function sendFriendRequest(targetUid, fromUid, fromUsername) {
    await fetch(`${BASE_URL}/send-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid, fromUid, fromUsername }),
    });
}

export async function getIncomingRequests(uid) {
    const res = await fetch(`${BASE_URL}/requests/${uid}`);
    return await res.json();
}

export async function respondToFriendRequest(currentUid, fromUid, accept) {
    await fetch(`${BASE_URL}/respond-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUid, fromUid, accept }),
    });
}

export async function getFriends(uid) {
    const res = await fetch(`${BASE_URL}/friends/${uid}`);
    return await res.json();
}
