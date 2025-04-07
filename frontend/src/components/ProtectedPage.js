import React, { useEffect, useState } from 'react';

function ProtectedPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/protected', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message + ' (User ID: ' + data.userId + ')');
        } else {
          setMessage(data.message || 'Not authorized');
        }
      } catch (error) {
        console.error(error);
        setMessage('Something went wrong.');
      }
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      <p>{message}</p>
    </div>
  );
}

export default ProtectedPage;
