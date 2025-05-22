import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Tournament() {
    const navigate = useNavigate();
    const [pairing, setPairing] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const tournamentId = "spring_open"; // adjust dynamically later

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const res = await fetch(`http://localhost:5001/api/tournaments/pairings/${tournamentId}/${user.uid}`);
                    const data = await res.json();

                    if (!res.ok) throw new Error(data.message);

                    setPairing(data);
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                }
            } else {
                setError("User not logged in.");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const joinGame = () => {
        if (pairing?.gameRoomId) {
            navigate(`/chess?room=${pairing.gameRoomId}`);
        }
    };

    if (loading) return <p className="text-white p-4">Loading...</p>;
    if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
    if (!pairing) return <p className="text-white p-4">No pairing found.</p>;

    return (
        <div className="p-6 bg-gray-800 text-white">
            <h3 className="text-2xl font-semibold mb-4">Your Tournament Matchup</h3>
            <p className="mb-2">
                Opponent UID:{" "}
                {pairing.player1Uid === auth.currentUser.uid
                    ? pairing.player2Uid
                    : pairing.player1Uid}
            </p>
            <button
                onClick={joinGame}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded"
            >
                Join Match
            </button>
        </div>
    );
}

export default Tournament;
