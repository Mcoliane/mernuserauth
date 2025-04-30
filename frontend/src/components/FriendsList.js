import React, { useState } from 'react';

function FriendsList() {
    const [friends, setFriends] = useState(['Alice', 'Bob', 'Charlie']);
    const [newFriend, setNewFriend] = useState('');

    const handleAddFriend = () => {
        if (newFriend.trim() && !friends.includes(newFriend)) {
            setFriends([...friends, newFriend.trim()]);
            setNewFriend('');
        }
    };

    const handleRemoveFriend = (name) => {
        setFriends(friends.filter(friend => friend !== name));
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Friends List</h2>
            <ul>
                {friends.map((friend, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {friend}
                        <button onClick={() => handleRemoveFriend(friend)}>Remove</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                placeholder="Add a friend"
            />
            <button onClick={handleAddFriend}>Add</button>
        </div>
    );
}

export default FriendsList;
