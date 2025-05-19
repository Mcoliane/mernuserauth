import React, {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import {Chessboard} from "react-chessboard";
import {Chess} from "chess.js";
import io from "socket.io-client";
import toast, {Toaster} from "react-hot-toast";

const socket = io("http://localhost:5001/chess");

function OnlineGameMode() {
    const location = useLocation();
    const roomFromUrl = new URLSearchParams(location.search).get("room");

    const chessRef = useRef(new Chess());
    const [gameFen, setGameFen] = useState(chessRef.current.fen());
    const [color, setColor] = useState("w");
    const [room, setRoom] = useState(roomFromUrl || "");
    const [joined, setJoined] = useState(!!roomFromUrl);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);


    useEffect(() => {
        chessRef.current = new Chess();
        setGameFen(chessRef.current.fen());
        setGameOver(false);
        setColor("w");

        sessionStorage.removeItem("fen");
        sessionStorage.removeItem("color");
        sessionStorage.removeItem("joined");
        if (roomFromUrl) {
            sessionStorage.setItem("room", roomFromUrl);
        }
    }, [roomFromUrl]);

    useEffect(() => {
        socket.on("player-color", (assignedColor) => {
            setColor(assignedColor);
            sessionStorage.setItem("color", assignedColor);
        });

        socket.on("move", ({ from, to, promotion }) => {
            const move = { from, to };
            if (promotion) move.promotion = promotion;
            const result = chessRef.current.move(move);
            if (result) {
                const newFen = chessRef.current.fen();
                setGameFen(newFen);
                sessionStorage.setItem("fen", newFen);
            }
        });

        socket.on("game-over", ({ winner }) => {
            setGameOver(true);
            setWinner(winner);
            toast.success(`Game over! Winner: ${winner}`);
        });


        socket.on("opponent-left", () => {
            setGameOver(true);
            toast.error("Opponent disconnected.");
        });

        socket.on("room-full", () => {
            setError("Room is full. Please try another room.");
            setJoined(false);
        });

        if (roomFromUrl && !sessionStorage.getItem("joined")) {
            socket.emit("join-room", roomFromUrl);
            sessionStorage.setItem("joined", "true");
        }

        return () => {
            socket.off("player-color");
            socket.off("move");
            socket.off("game-over");
            socket.off("opponent-left");
            socket.off("room-full");
        };
    }, [roomFromUrl, room, color]);

    const handleJoin = () => {
        if (!room) return;

        chessRef.current.reset();
        setGameFen(chessRef.current.fen());
        setGameOver(false);
        setColor("w");

        sessionStorage.removeItem("fen");
        sessionStorage.removeItem("color");
        sessionStorage.removeItem("joined");
        sessionStorage.setItem("joined", "true");
        sessionStorage.setItem("room", room);

        socket.emit("join-room", room);
        setJoined(true);
        setError("");
    };

    const handleCreateRoom = () => {
        const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoom(newRoom);
        setShowModal(true);

        chessRef.current.reset();
        setGameFen(chessRef.current.fen());
        setGameOver(false);
        setColor("w");

        sessionStorage.clear();
        sessionStorage.setItem("room", newRoom);
        sessionStorage.setItem("joined", "true");

        socket.emit("join-room", newRoom);
        setJoined(true);
        window.history.replaceState({}, "", `?room=${newRoom}`);
    };

    const onDrop = (sourceSquare, targetSquare) => {
        if (gameOver) return false;

        const piece = chessRef.current.get(sourceSquare);
        if (!piece || piece.color !== color) return false;

        const isPromotion = piece.type === "p" &&
            ((piece.color === "w" && targetSquare[1] === "8") ||
             (piece.color === "b" && targetSquare[1] === "1"));

        const move = chessRef.current.move({
            from: sourceSquare,
            to: targetSquare,
            ...(isPromotion ? { promotion: "q" } : {})
        });

        if (move) {
            const newFen = chessRef.current.fen();
            setGameFen(newFen);
            sessionStorage.setItem("fen", newFen);
            socket.emit("move", { room, from: sourceSquare, to: targetSquare, ...(isPromotion ? { promotion: "q" } : {}) });

            if (chessRef.current.isGameOver()) {
                setGameOver(true);
                const winnerName = chessRef.current.turn() === "w" ? "Black" : "White";
                setWinner(winnerName);
                toast.success(`You won!`);
                socket.emit("game-over", { room, winner: winnerName });
            }

        }

        return !!move;
    };

    const resetGame = () => {
        chessRef.current.reset();
        const resetFen = chessRef.current.fen();
        setGameFen(resetFen);
        sessionStorage.setItem("fen", resetFen);
        setGameOver(false);
    };

    const returnToMenu = () => {
        sessionStorage.clear();
        window.location.href = "/";
    };

    const copyToClipboard = () => navigator.clipboard.writeText(room);

    if (!joined) {
        return (
            <div className="flex flex-col items-center text-white space-y-6 w-full max-w-sm mx-auto">
                <h2 className="text-2xl font-semibold">Join or Create Room</h2>
                <div className="w-full space-y-2">
                    <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value.toUpperCase())}
                        placeholder="Enter Room Code"
                        className="w-full p-2 rounded bg-gray-700 border border-white/30 text-white placeholder-gray-400"
                    />
                    <button
                        onClick={handleJoin}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-full transition duration-300"
                    >
                        Join Room
                    </button>
                </div>
                <div className="text-gray-400 text-sm">OR</div>
                <button
                    onClick={handleCreateRoom}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-full transition duration-300"
                >
                    Create New Room
                </button>
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="flex flex-col items-center space-y-4 text-white w-full">
                <h3 className="text-center text-lg font-mono bg-gray-700 py-1 px-3 rounded">
                    Room Code: {room}
                </h3>
                <p className="text-lg font-medium">
                    You are playing as <span className="uppercase font-bold">{color}</span>
                </p>
                {gameOver && winner && (
                    <div className="text-xl font-bold text-green-400 mt-4">
                        Game Over! Winner: {winner}
                    </div>
                )}
                <Chessboard
                    position={gameFen}
                    onPieceDrop={onDrop}
                    boardOrientation={color === "w" ? "white" : "black"}
                    boardWidth={500}
                />
                {gameOver && (
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={resetGame}
                            className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-full"
                        >
                            Rematch
                        </button>
                        <button
                            onClick={returnToMenu}
                            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-full"
                        >
                            Return to Menu
                        </button>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-white w-80 space-y-4 text-center">
                        <h2 className="text-xl font-semibold">Room Created</h2>
                        <p className="text-lg font-mono tracking-wider bg-black/40 rounded py-2 px-4 border border-white/20">
                            {room}
                        </p>
                        <button
                            onClick={copyToClipboard}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full"
                        >
                            Copy Room Code
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-full transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default OnlineGameMode;