// RulesPopup.js
import React, {useState} from "react";

export default function RulesPopup() {
    const [isOpen, setIsOpen] = useState(false);

    return (<>
        {/* Button to open the modal */}
        <button
            onClick={() => setIsOpen(true)}
            className="fixed top-12 right-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
        >
            Rules
        </button>

        {/* Modal Backdrop + Content */}
        {isOpen && (<div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-lg shadow-2xl text-white relative">
                <h2 className="text-3xl font-bold mb-6 text-yellow-500 text-center">
                    ♟️ Game Rules
                </h2>
                <div className="space-y-4 text-base">
                    <p><strong>Objective:</strong> Checkmate your opponent's king.</p>
                    <p><strong>Piece Movement:</strong> Each piece moves differently. Use them strategically!
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Castling</li>
                        <li>En passant</li>
                        <li>Promotion</li>
                    </ul>
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
        </div>)}
    </>);
}

