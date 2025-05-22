import React from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../config/firebase';

function TournamentSignup() {
    const { id } = useParams();

    const handleSignup = async () => {
        const user = auth.currentUser;
        if (!user) return alert('Please log in.');

        await fetch(`http://localhost:5001/api/tournaments/join/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, username: user.displayName })
        });

        alert('Registered successfully!');
    };

    return (
        <div className="p-6 bg-gray-800 text-white">
            <h2>Signup for Tournament {id}</h2>
            <button
                onClick={handleSignup}
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-400 rounded"
            >
                Join Tournament
            </button>
        </div>
    );
}

export default TournamentSignup;
