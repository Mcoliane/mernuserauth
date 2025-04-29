import React, {useState, useRef, forwardRef, useImperativeHandle} from "react";
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
        if (moveMade && mode === "AI") {
            gameRef.current.aiMove();
            setFen(gameRef.current.exportFEN());
        }
    };

    // Expose reset and undo to the parent
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