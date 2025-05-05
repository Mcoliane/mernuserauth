import React, {useEffect, useRef, useState} from "react";
import {Chessboard} from "react-chessboard";
import {Chess} from "chess.js";
import io from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";

const socket = io("http://localhost:5001/game", {
    path: '/socket.io',  // this path is the default, but you may need to set it explicitly
});

function OnlineRankedMode() {
    const [gameFen, setGameFen] = useState(new Chess().fen());
    const [color, setColor] = useState("w");
    const [gameOver, setGameOver] = useState(false);
    const [matchmaking, setMatchmaking] = useState(true);
    const chessRef = useRef(new Chess());

    const opposite = (c) => (c === "w" ? "b" : "w");

    useEffect(() => {
        chessRef.current.reset();
        setGameFen(chessRef.current.fen());
        setGameOver(false);
        setMatchmaking(true);
    }, []);

    useEffect(() => {
        socket.emit("join-ranked-queue");
        toast.loading("Searching for opponent...", {id: "match"});

        socket.on("ranked-match-found", ({assignedColor}) => {
            setColor(assignedColor);
            chessRef.current.reset();
            setGameFen(chessRef.current.fen());
            setMatchmaking(false);
            toast.dismiss("match");
            toast.success("Opponent found! You play as " + assignedColor);
        });

        socket.on("move", ({from, to}) => {
            const move = chessRef.current.move({from, to});

            if (!move) {
                console.warn("Received illegal move:", {from, to});
                console.warn("Current FEN:", chessRef.current.fen());
                return;
            }

            const newFen = chessRef.current.fen();
            setGameFen(newFen);

            if (chessRef.current.isGameOver()) {
                const youWon = chessRef.current.turn() !== color;
                setGameOver(true);
                toast[youWon ? "success" : "error"](youWon ? "You won!" : "You lost!");
                socket.emit("ranked-game-over", {
                    winner: youWon ? color : opposite(color),
                });
            }
        });

        return () => {
            socket.off("ranked-match-found");
            socket.off("move");
        };
    }, []);

    const onDrop = (sourceSquare, targetSquare) => {
        if (gameOver || matchmaking) return false;

        const piece = chessRef.current.get(sourceSquare);
        if (!piece) {
            console.warn("No piece on", sourceSquare);
            return false;
        }

        if (piece.color !== color || chessRef.current.turn() !== color) {
            console.warn("Not your turn or wrong color piece");
            return false;
        }

        const isPromotion = piece.type === "p" && ((piece.color === "w" && targetSquare[1] === "8") || (piece.color === "b" && targetSquare[1] === "1"));

        const move = chessRef.current.move({
            from: sourceSquare, to: targetSquare, ...(isPromotion ? {promotion: "q"} : {}),
        });

        if (!move) {
            console.warn("Illegal move attempted:", {from: sourceSquare, to: targetSquare});
            return false;
        }

        const newFen = chessRef.current.fen();
        setGameFen(newFen);
        socket.emit("move", {from: sourceSquare, to: targetSquare});

        if (chessRef.current.isGameOver()) {
            const youWon = chessRef.current.turn() !== color;
            setGameOver(true);
            toast[youWon ? "success" : "error"](youWon ? "You won!" : "You lost!");
            socket.emit("ranked-game-over", {
                winner: youWon ? color : opposite(color),
            });
        }

        return true;
    };

    return (<>
            <Toaster position="top-center"/>
            <div className="flex flex-col items-center space-y-6 text-white">
                {matchmaking ? (<p className="text-lg">Waiting for opponent...</p>) : (<>
                        <p className="text-lg">
                            You are playing as <strong>{color}</strong>
                        </p>
                        <Chessboard
                            position={gameFen}
                            onPieceDrop={onDrop}
                            boardOrientation={color === "w" ? "white" : "black"}
                        />
                    </>)}
                {gameOver && (<button
                        onClick={() => window.location.href = "/"}
                        className="mt-4 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-full"
                    >
                        Return to Menu
                    </button>)}
            </div>
        </>);
}

export default OnlineRankedMode;