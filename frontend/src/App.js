import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedPage from './components/ProtectedPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>{' '}
          <Link to="/Register">Register</Link>{' '}
          <Link to="/Login">Login</Link>{' '}
          <Link to="/Protected">Protected</Link>
        </nav>
        <Routes>
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Protected" element={<ProtectedPage />} />
          <Route path="/" element={<div><h1>Home</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
