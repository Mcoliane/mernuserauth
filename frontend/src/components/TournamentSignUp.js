import React from 'react';
import { useParams } from 'react-router-dom';

function TournamentSignup() {
    const { id } = useParams();

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
            <h2>Signup for Tournament</h2>
            <p>You are signing up for Tournament ID: <strong>{id}</strong></p>

        </div>
    );
}

export default TournamentSignup;
