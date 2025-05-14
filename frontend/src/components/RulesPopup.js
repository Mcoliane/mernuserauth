// RulesPopup.js
import React, {useState} from "react";
import rulesData from "./RulesData"; // Adjust path if needed

export default function RulesPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const chessRules = rulesData.chess;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-12 right-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
            >
                Rules
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-screen-xl shadow-2xl text-white relative">
                        <h2 className="text-3xl font-bold mb-6 text-yellow-500 text-center">
                            ♟️ {chessRules.title}
                        </h2>
                        <p className="mb-6 text-gray-300">{chessRules.description}</p>

                        <div className="space-y-4 text-base">
                            {chessRules.sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-lg font-semibold mb-1">{section.heading}</h3>
                                    <div className="text-gray-300">{section.content}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-3 rounded-full transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
