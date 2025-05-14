import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedPage from './components/ProtectedPage';
import NavComp from './components/Nav';
import ChessRouter from "./components/ChessRouter";
import Chat from "./components/ChatBot";
import {HeroUIProvider} from "@heroui/react";
import UserProfile from "./components/Profile";
import Footer from './components/Footer';
import RulesPage from "./components/RulesPage";
import Tournament from "./components/Tournament";
import FriendsList from "./components/FriendsList";
import TournamentSignUp from "./components/TournamentSignUp";

function App() {
    return (

        <HeroUIProvider>
            <Router>
                {/* Main page layout */}
                <div className="flex flex-col min-h-screen bg-white text-black">
                    <NavComp/>

                    {/* This div will grow and push the footer to bottom if needed */}
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/protected" element={<ProtectedPage/>}/>
                            <Route path="/chess" element={<ChessRouter/>}/>
                            <Route path="/howToPlay" element={<RulesPage/>}/>
                            <Route path="/tournaments" element={<Tournament/>}/>
                            <Route path="/friends" element={<FriendsList/>}/>
                            <Route path="/tournamentsignup/:id" element={<TournamentSignUp/>}/>
                            <Route
                                path="/profile"
                                element={<UserProfile
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
                                />}
                            />
                        </Routes>
                    </main>

                    {/* Always at the bottom */}
                    <Footer/>
                </div>
            </Router>

            {/* Chat widget can float separately */}
            <Chat/>
        </HeroUIProvider>);
}

export default App;