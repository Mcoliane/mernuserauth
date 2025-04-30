import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tournament() {
    const navigate = useNavigate();

    const tournaments = [
        { id: 1, name: 'Spring Open', date: '2025-05-10', location: 'Online' },
        { id: 2, name: 'Summer Classic', date: '2025-07-01', location: 'New York' },
        { id: 3, name: 'Fall Invitational', date: '2025-09-15', location: 'Online' },
    ];

    const handleTournamentClick = (id) => {
        navigate(`/tournamentsignup/${id}`);
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
            <h2>Upcoming Chess Tournaments</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tournaments.map((tournament) => (
                    <li
                        key={tournament.id}
                        onClick={() => handleTournamentClick(tournament.id)}
                        style={{
                            marginBottom: '15px',
                            padding: '10px',
                            border: '1px solid gray',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <strong>{tournament.name}</strong><br />
                        Date: {tournament.date}<br />
                        Location: {tournament.location}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tournament;
