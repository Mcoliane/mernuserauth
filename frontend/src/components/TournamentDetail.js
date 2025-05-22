import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

function TournamentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);

        fetch(`http://localhost:5001/api/tournaments/${id}`)
            .then(res => res.json())
            .then(data => setTournament(data));
    }, [id]);

    const handleSignup = async () => {
        if (!user) return alert("Log in first");

        await fetch(`http://localhost:5001/api/tournaments/join/${id}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, username: user.displayName })
        });

        alert("You joined the tournament!");
    };

    const handlePlay = () => {
        navigate(`/tournaments`);
    };

    if (!tournament) return <p className="p-4 text-white">Loading...</p>;

    return (
        <div className="p-6 text-white">
            <h2 className="text-3xl font-bold mb-4">{tournament.name}</h2>
            <p>Status: {tournament.status}</p>
            <p>Start Time: {tournament.startTime || "TBD"}</p>
            <p>Players Registered: {Object.keys(tournament.players || {}).length}</p>

            <button onClick={handleSignup} className="mt-4 px-4 py-2 bg-green-500 rounded">
                Sign Up
            </button>

            {tournament.status === "in_progress" && (
                <button onClick={handlePlay} className="mt-4 ml-4 px-4 py-2 bg-blue-500 rounded">
                    Start Playing
                </button>
            )}
        </div>
    );
}

export default TournamentDetail;
