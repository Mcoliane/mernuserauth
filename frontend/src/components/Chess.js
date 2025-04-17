import React, { useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Game } from "js-chess-engine";

function ChessBoard() {
    const gameRef = useRef(null);
    const [fen, setFen] = useState(""); // Initialize with an empty string

    // Initialize the game instance only once
    if (!gameRef.current) {
        gameRef.current = new Game();
        setFen(gameRef.current.exportFEN());
    }

    const makeAMove = (from, to) => {
        try {
            gameRef.current.move(from, to);
            setFen(gameRef.current.exportFEN());
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const onDrop = (sourceSquare, targetSquare) => {
        const moveMade = makeAMove(sourceSquare, targetSquare);
        if (moveMade) {
            // Engine makes a move
            gameRef.current.aiMove();
            setFen(gameRef.current.exportFEN());
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-chess-game bg-cover bg-center px-4 py-12">
            <div
                className="w-full max-w-xl bg-black/60 backdrop-blur-xl rounded-2xl border border-white/30 p-8 shadow-2xl space-y-6">
                <h1 className="text-center text-4xl font-semibold text-white mb-4 tracking-wider uppercase">
                    ♞ Chess Master
                </h1>

                <div className="flex justify-center items-center">
                    <Chessboard
                        position={fen}
                        onPieceDrop={onDrop}
                    />
                </div>

                <div className="text-center mt-4 text-lg text-gray-300">
                    <span className="font-semibold text-white">AI Opponent</span> • <span className="italic">Make your move!</span>
                </div>

                {/* Optional Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-green-600 text-white rounded-full px-6 py-3 shadow-md hover:bg-green-500 transition duration-300">
                        Reset Game
                    </button>
                    <button
                        className="bg-gray-600 text-white rounded-full px-6 py-3 shadow-md hover:bg-gray-500 transition duration-300">
                        Undo Move
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChessBoard;