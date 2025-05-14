import React from "react";

const rulesData = {
    chess: {
        title: "Chess Rules",
        description:
            "Chess is a strategic board game played between two players. The objective is to checkmate your opponent's king, meaning it is under threat of capture and cannot escape.",
        sections: [
            {
                heading: "Objective",
                content: (
                    <p>
                        Checkmate your opponent's king while keeping your own king safe. A checkmate ends the game immediately.
                    </p>
                ),
            },
            {
                heading: "How to Move Pieces",
                content: (
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Pawn</strong>: Moves forward 1 square (or 2 from its starting position), captures diagonally.</li>
                        <li><strong>Knight</strong>: Moves in an “L” shape. Jumps over pieces.</li>
                        <li><strong>Bishop</strong>: Moves diagonally any number of squares.</li>
                        <li><strong>Rook</strong>: Moves horizontally or vertically any number of squares.</li>
                        <li><strong>Queen</strong>: Combines the moves of a rook and bishop.</li>
                        <li><strong>King</strong>: Moves 1 square in any direction.</li>
                    </ul>
                ),
            },
            {
                heading: "Special Moves",
                content: (
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Castling</strong>: A special move with the king and rook under specific conditions.</li>
                        <li><strong>En Passant</strong>: A special pawn capture when an opponent's pawn moves two squares.</li>
                        <li><strong>Promotion</strong>: A pawn reaching the back rank is promoted to another piece, usually a queen.</li>
                    </ul>
                ),
            },
            {
                heading: "End of the Game",
                content: (
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Checkmate</strong>: The king is in check and cannot escape—game over.</li>
                        <li><strong>Stalemate</strong>: The player has no legal moves and is not in check—draw.</li>
                        <li><strong>Draws</strong>: Also possible by repetition, 50-move rule, or mutual agreement.</li>
                    </ul>
                ),
            },
        ],
    }, blitz: {
        title: "Blitz Chess Rules",
        description: "Blitz games are fast-paced games with a time control of under 10 minutes for each player.",
        sections: [{
            heading: "Time Control",
            content: "Each player typically has 3 to 5 minutes. Some blitz games include time increments.",
        }, {
            heading: "Rapid Moves",
            content: "You must move quickly; if your time runs out, you lose—even if you're winning on the board!",
        },],
    },
};

export default rulesData;