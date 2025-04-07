import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedPage from './components/ProtectedPage';
import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>{' '}
          <Link to="/register">Register</Link>{' '}
          <Link to="/login">Login</Link>{' '}
          <Link to="/protected">Protected</Link>{' '}
          <LogoutButton />
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/" element={<div><h1>Home</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
