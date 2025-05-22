import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Auth from './components/Auth';
import ProtectedPage from './components/ProtectedPage';
import NavComp from './components/Nav';
import ChessBoard from "./components/Chess";
import Chat from "./components/ChatBot";
import { HeroUIProvider } from "@heroui/react";
import UserProfile from "./components/Profile";
import Footer from './components/Footer';
import RulesPage from "./components/RulesPage";
import FriendsList from "./components/Friends";
import TournamentSignUp from "./components/TournamentSignUp";
import Tournament from "./components/Tournament";

// ✅ NEW imports
import TournamentList from './components/TournamentList';
import TournamentDetail from './components/TournamentDetail';

function App() {
    return (
        <HeroUIProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-white text-black">
                    <NavComp />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Auth />} />
                            <Route path="/protected" element={<ProtectedPage />} />
                            <Route path="/chess" element={<ChessBoard />} />
                            <Route path="/howToPlay" element={<RulesPage />} />
                            <Route path="/friends" element={<FriendsList />} />
                            <Route path="/profile" element={
                                <UserProfile
                                    user={{
                                        name: 'Magnus Carlson',
                                        email: 'magnus@chess.com',
                                        bio: 'World Champion. Grandmaster. Coffee enthusiast.',
                                        avatar: 'https://i.pravatar.cc/150?img=5',
                                        bestTime: '1:45',
                                        highScore: '2870',
                                        gamesPlayed: 120,
                                        winRate: '92%',
                                    }}
                                />
                            } />

                            {/* ✅ NEW tournament routes */}
                            <Route path="/tournaments" element={<TournamentList />} />
                            <Route path="/tournaments/:id" element={<TournamentDetail />} />
                            <Route path="/tournamentsignup/:id" element={<TournamentSignUp />} />
                            <Route path="/tournament" element={<Tournament />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
                <Chat />
            </Router>
        </HeroUIProvider>
    );
}

export default App;
