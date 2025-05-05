import React from "react";

function GameModeSelector({onSelect}) {
    const modes = [{label: "Play vs AI", value: "AI"}, {
        label: "Player vs Player",
        value: "VS"
    }, {label: "Online Multiplayer", value: "ONLINE"}, {label: "Ranked Match", value: "RANKED"},];

    return (<div className="grid grid-cols-2 gap-4">
            {modes.map((mode) => (<button
                    key={mode.value}
                    onClick={() => onSelect(mode.value)}
                    className="bg-gray-700 hover:bg-green-600 transition-colors duration-300 text-white text-lg font-medium py-4 px-6 rounded-2xl shadow-lg"
                >
                    {mode.label}
                </button>))}
        </div>);
}

export default GameModeSelector;
