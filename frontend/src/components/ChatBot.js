import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@heroui/react"; // Use Hero UI Accordion components

const socket = io("http://localhost:3001"); // your backend URL

export default function Chat() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Manage the open/close state

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setChat((prev) => [...prev, data]);
        });

        return () => socket.off("receive_message");
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("send_message", message);
            setMessage("");
        }
    };
    const friends = '2 online';
    return (<div className="fixed bottom-5 right-5 z-50 min-w-lg">
        <Accordion>
            <AccordionItem>
                    {/* Accordion header that toggles visibility */}
                    <div
                        className=" bg-gray-300 min-w-max p-2 rounded-md hover:bg-gray-400 bg-yellow-400"
                        onClick={() => setIsOpen(!isOpen)} // Toggle open/close
                    >
                        Chat
                    </div>

                    {/* Accordion content */}
                    {isOpen && (
                        <div className=" p-4 max-w-md mx-auto shadow-lg rounded bg-white">
                            <div className=" h-64 overflow-y-auto border p-2 mb-2">
                                {chat.map((msg, idx) => (
                                    <div key={idx} className=" mb-1 text-sm text-gray-700">{msg}</div>
                                ))}
                            </div>
                            <div className=" flex gap-2">
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className=" border p-2 flex-1 rounded"
                                    placeholder=" Type message..."
                                />
                                <button onClick={sendMessage} className=" bg-blue-500 text-white px-4 rounded">
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </AccordionItem>
            </Accordion>
        </div>
    );
}
