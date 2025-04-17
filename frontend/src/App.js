import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedPage from './components/ProtectedPage';
import LogoutButton from './components/LogoutButton';
import NavComp from './components/Nav';
import ChessBoard from "./components/Chess";
import Chat from "./components/ChatBot";
import { HeroUIProvider } from "@heroui/react";

function App() {
    return (
        <HeroUIProvider>
            <Router>
                    <div className="min-h-screen min-w-screen bg-white text-black">
                        <NavComp />

                            <Routes>
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/protected" element={<ProtectedPage />} />
                                <Route path="/chess" element={<ChessBoard />} />
                                <Route
                                    path="/"
                                    element={
                                        <div className="p-8">
                                            <h1 className="text-3xl font-bold mb-4">Home</h1>
                                            <p className="text-gray-700">Welcome to the homepage.</p>
                                            <LogoutButton />
                                        </div>
                                    }
                                />
                            </Routes>
                    </div>
            </Router>
            <Chat />
        </HeroUIProvider>
);
}

export default App;