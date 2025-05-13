import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Chessboard } from "react-chessboard";
import { Game } from "js-chess-engine";

// Use forwardRef so parent can call functions
const ChessGameMode = forwardRef(({ mode }, ref) => {
    const gameRef = useRef(null);
    const [fen, setFen] = useState("");

    if (!gameRef.current) {
        gameRef.current = new Game();
        setFen(gameRef.current.exportFEN());
    }

    const checkGameOver = () => {
        const state = gameRef.current.exportJson();

        if (state.checkMate) {
            const winner = state.turn === 1 ? "Black" : "White";  // Turn is on loser
            alert(`${winner} wins by checkmate!`);
            return true;
        }

        if (state.staleMate) {
            alert("Draw by stalemate.");
            return true;
        }

        if (state.insufficientMaterial) {
            alert("Draw by insufficient material.");
            return true;
        }

        return false;
    };

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
            const gameOver = checkGameOver();

            if (!gameOver && mode === "AI") {
                gameRef.current.aiMove();
                setFen(gameRef.current.exportFEN());

                setTimeout(() => {
                    checkGameOver();
                }, 100);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        resetGame: () => {
            gameRef.current = new Game();
            setFen(gameRef.current.exportFEN());
        },
    }));

    return (
        <Chessboard
            position={fen}
            onPieceDrop={onDrop}
        />
    );
});

export default ChessGameMode;