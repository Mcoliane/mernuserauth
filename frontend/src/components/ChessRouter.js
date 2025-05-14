
import React from "react";
import ChessGameMode from "./ChessGameMode";
import OnlineGameMode from "./OnlineGameMode";
import OnlineRankedMode from "./OnlineRankedMode";

function ChessRouter() {
    const mode = sessionStorage.getItem("mode");

    if (mode === "ai") return <ChessGameMode mode="AI" />;
    if (mode === "pvp") return <OnlineGameMode />;
    if (mode === "ranked") return <OnlineRankedMode />;

    return <p className="text-white text-center p-4">No mode selected. Go back and choose a game mode.</p>;
}

export default ChessRouter;
