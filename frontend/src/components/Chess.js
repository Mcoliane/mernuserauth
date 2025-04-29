import React, {useState, useRef} from "react";
import ChessGameMode from './ChessGameMode';
import RulesPopup from "./RulesPopup";

function ChessBoard() {
    const [mode, setMode] = useState("AI");
    const gameModeRef = useRef(); // <- new

    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    const handleResetGame = () => {
        gameModeRef.current?.resetGame();
    };

    return (<div
            className="min-h-screen flex items-center justify-center bg-chess-game bg-cover bg-center px-4 py-12">
            <div
                className="w-full max-w-xl bg-black/60 bg-black-500 rounded-2xl border border-white/30 p-8 shadow-2xl space-y-6">
                <h1 className="text-center text-4xl font-semibold text-white mb-4 tracking-wider uppercase">
                    ♞ Chess Master
                </h1>

                {/* Mode Selector */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => handleModeChange("AI")}
                        className={`px-4 py-2 rounded-full ${mode === "AI" ? "bg-green-600" : "bg-gray-600"} text-white`}>
                        Play vs AI
                    </button>
                    <button
                        onClick={() => handleModeChange("VS")}
                        className={`px-4 py-2 rounded-full ${mode === "VS" ? "bg-green-600" : "bg-gray-600"} text-white`}>
                        Player vs Player
                    </button>
                </div>

                <div className="flex justify-center items-center relative">
                    <ChessGameMode ref={gameModeRef} mode={mode}/>
                </div>

                <div className="text-center mt-4 text-lg text-gray-300">
                    <span
                        className="font-semibold text-white">{mode === "AI" ? "AI Opponent" : "Player vs Player"}</span> • <span
                    className="italic">Make your move!</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        onClick={handleResetGame}
                        className="bg-green-600 text-white rounded-full px-6 py-3 shadow-md hover:bg-green-500 transition duration-300">
                        Reset Game
                    </button>

                </div>
            </div>
            <RulesPopup/>
        </div>

    );
}

export default ChessBoard;