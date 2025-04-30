import React from "react";
import {Accordion, AccordionItem} from "@heroui/react";

const rulesData = {
    chess: {
        title: "Chess Rules",
        description: "Chess is a strategic board game played between two players. The objective is to checkmate your opponent's king.",
        sections: [{
            heading: "Objective", content: "Checkmate the opposing king while keeping your own king safe."
        }, {
            heading: "How to Move Pieces",
            content: "Each piece moves differently: pawns move forward, knights in L-shapes, bishops diagonally, etc."
        }, {
            heading: "Special Moves", content: "Castling, En Passant, Promotion."
        }]
    }, blitz: {
        title: "Blitz Chess Rules",
        description: "Blitz games are fast-paced games with a time control of under 10 minutes for each player.",
        sections: [{
            heading: "Time Control", content: "Each player typically has 3 to 5 minutes."
        }, {
            heading: "Rapid Moves", content: "You must move quickly; if your time runs out, you lose!"
        }]
    }
};

export default function RulesPage() {
    return (<div
        className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-black text-white px-6 pt-20">
        <h1 className="text-5xl font-bold mb-10 text-yellow-500">Game Rules</h1>

        <Accordion selectionMode="multiple" variant="splitted" className="max-w-4xl w-full">
            {Object.entries(rulesData).map(([key, game]) => (<AccordionItem key={key} title={game.title}
                                                                            className="bg-white/10 rounded-2xl border border-white/20 text-white">
                <div className="p-4">
                    <p className="text-gray-300 mb-6">{game.description}</p>
                    <div className="space-y-4">
                        {game.sections.map((section, index) => (<div key={index}>
                            <h3 className="font-semibold text-lg text-white mb-1">{section.heading}</h3>
                            <p className="text-gray-400">{section.content}</p>
                        </div>))}
                    </div>
                </div>
            </AccordionItem>))}
        </Accordion>
    </div>);
}