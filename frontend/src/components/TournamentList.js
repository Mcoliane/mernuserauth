import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TournamentList() {
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/tournaments');
                const data = await res.json();

                if (!Array.isArray(data)) throw new Error("Invalid data from server");
                setTournaments(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not load tournaments.");
            }
        };

        fetchTournaments();
    }, []);

    if (error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="p-6 text-gray-400">
            <h2 className="text-3xl font-bold mb-4">Available Tournaments</h2>

            {tournaments.length === 0 ? (
                <p className="text-gray-400">No tournaments yet. Please check back later.</p>
            ) : (
                tournaments.map(t => (
                    <div key={t.id} className="bg-gray-700 p-4 mb-4 rounded">
                        <h3 className="text-xl font-semibold">{t.name}</h3>
                        <p>Status: {t.status}</p>
                        <p>Players: {t.playerCount}</p>
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded"
                            onClick={() => navigate(`/tournaments/${t.id}`)}
                        >
                            View Tournament
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default TournamentList;
