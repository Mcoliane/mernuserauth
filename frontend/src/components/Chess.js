import React, {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import ChessGameMode from "./ChessGameMode";
import RulesPopup from "./RulesPopup";
import OnlineGameMode from "./OnlineGameMode";
import OnlineRankedMode from "./OnlineRankedMode";
import GameModeSelector from "./GameModeSelection";

function ChessBoard() {
    const [mode, setMode] = useState(null);
    const [sessionKey, setSessionKey] = useState(null);
    const gameModeRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    // Read the session key from sessionStorage
    useEffect(() => {
        const storedSessionKey = sessionStorage.getItem("sessionKey");
        if (storedSessionKey) {
            setSessionKey(storedSessionKey);
            const storedMode = sessionStorage.getItem(storedSessionKey + "-mode");
            if (storedMode) {
                setMode(storedMode);
            }
        } else {
            const newSessionKey = Math.random().toString(36).substr(2, 9); // Generate a random key
            sessionStorage.setItem("sessionKey", newSessionKey);
            setSessionKey(newSessionKey);
        }
    }, []);

    // Watch for mode changes and store it in sessionStorage
    useEffect(() => {
        if (sessionKey && mode) {
            sessionStorage.setItem(`${sessionKey}-mode`, mode);
        }
    }, [mode, sessionKey]);

    // Confirmation dialog before leaving
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (mode) {
                event.preventDefault();
                event.returnValue = "Are you sure you want to leave? Your progress may be lost.";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [mode]);

    const handleResetGame = () => {
        gameModeRef.current?.resetGame();
    };

    const handleModeSelection = (newMode) => {
        // Clear previous mode state
        sessionStorage.removeItem(`${sessionKey}-mode`);
        setMode(newMode);
        sessionStorage.setItem(`${sessionKey}-mode`, newMode);
        navigate(`/chess?mode=${newMode}`);
    };


    const handleBackButton = () => {
        if (window.confirm("Are you sure you want to go back and reset the game?")) {
            setMode(null);
            sessionStorage.removeItem(`${sessionKey}-mode`); // Clear the mode from sessionStorage
            navigate(`/chess`); // Navigate back to the game mode selection screen
        }
    };

    const renderGame = () => {
        switch (mode) {
            case "AI":
            case "VS":
                return <ChessGameMode ref={gameModeRef} mode={mode}/>;
            case "ONLINE":
                return <OnlineGameMode/>;
            case "RANKED":
                return <OnlineRankedMode/>;
            default:
                return null;
        }
    };

    return (<div className="min-h-screen flex items-center justify-center bg-chess-game bg-cover bg-center px-4 py-12">
            <div className="w-full max-w-xl bg-black/60 rounded-2xl border border-white/30 p-8 shadow-2xl space-y-6">
                <h1 className="text-center text-4xl font-semibold text-white mb-4 tracking-wider uppercase">
                    ♞ Chess Master
                </h1>

                {!mode ? (<GameModeSelector onSelect={handleModeSelection}/>) : (<>
                        <div className="flex justify-center items-center relative">
                            {renderGame()}
                        </div>

                        <div className="text-center mt-4 text-lg text-gray-300">
                            <span className="font-semibold text-white">
                                {{
                                    AI: "AI Opponent",
                                    VS: "Player vs Player",
                                    ONLINE: "Online Match",
                                    RANKED: "Ranked Match",
                                }[mode]}
                            </span>{" "}
                            • <span className="italic">Make your move!</span>
                        </div>

                        <div className="flex justify-center space-x-4 mt-4">
                            {mode === "AI" && (<button
                                    onClick={handleResetGame}
                                    className="bg-green-600 text-white rounded-full px-6 py-3 shadow-md hover:bg-green-500 transition duration-300"
                                >
                                    Reset Game
                                </button>)}
                            <button
                                onClick={handleBackButton}
                                className="bg-red-600 text-white rounded-full px-6 py-3 shadow-md hover:bg-red-500 transition duration-300"
                            >
                                Back
                            </button>
                        </div>
                    </>)}
            </div>

            <RulesPopup/>
        </div>);
}

export default ChessBoard;
