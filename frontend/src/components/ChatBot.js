import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your_shared_secret_key";

const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decryptMessage = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const socket = io("http://localhost:5001/chat");

export default function Chat() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [typing, setTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const chatEndRef = useRef(null);

    const username = useRef(`User${Math.floor(Math.random() * 1000)}`).current;

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // Register this user when the component mounts
        socket.emit("register_user", username);

        // Listen for updated online user list
        socket.on("online_users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off("online_users");
        };
    }, [username]);


    useEffect(() => {
        socket.on("receive_message", (data) => {
            const decryptedText = decryptMessage(data.text);
            setChat((prev) => [...prev, {...data, text: decryptedText}]);
        });

        socket.on("user_typing", () => {
            setTyping(true);
            setTimeout(() => setTyping(false), 2000);
        });

        return () => {
            socket.off("receive_message");
            socket.off("user_typing");
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chat]);

    const sendMessage = () => {
        if (message.trim()) {
            const encrypted = encryptMessage(message);
            const data = {
                user: username,
                text: encrypted,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            };
            socket.emit("send_message", data);
            setMessage("");
        }
    };


    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing");
    };

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (<div className="fixed bottom-5 right-3 z-50 w-80 text-white font-sans">
        {!isOpen ? (<button
            onClick={() => setIsOpen(true)}
            className="bg-yellow-500 text-black w-80 px-4 py-2 rounded-t-xl rounded-br-xl shadow-lg hover:bg-yellow-400 transition"
        >
            Chat ({onlineUsers.length} online)
        </button>) : (<div className="bg-black/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-yellow-500 text-black px-4 py-2">
                <span className="font-semibold">Chat</span>
                <button onClick={() => setIsOpen(false)} className="text-black hover:opacity-75">
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="h-60 overflow-y-auto px-4 py-2 text-sm space-y-1 bg-black/60">
                {chat.map((msg, idx) => {
                    const isMe = msg.user === username;
                    return (<div key={idx} className="flex flex-col">
      <span className={`font-semibold ${isMe ? 'text-green-400' : 'text-yellow-300'}`}>
        {isMe ? 'Me' : msg.user}
      </span>
                        <div className="flex justify-between items-center">
                            <span className="text-white">{msg.text}</span>
                            <span className="text-gray-400 text-xs ml-2">({msg.time})</span>
                        </div>
                    </div>);
                })}

                {typing && (<div className="italic text-gray-400">Someone is typing…</div>)}
                <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-white/20 px-2 py-2 bg-black/60 relative">
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-yellow-400 text-xl mr-2 hover:opacity-80"
                >
                    😊
                </button>

                <input
                    value={message}
                    onChange={handleTyping}
                    className="flex-1 bg-black/30 text-white px-3 py-1 rounded-l-full focus:outline-none"
                    placeholder="Type message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-r-full transition"
                >
                    Send
                </button>
            </div>

        </div>)}
        {/* Emoji Picker */}
        {showEmojiPicker && (<div className="absolute bottom-14 right-60 z-50">
            <div className="w-80 h-80 overflow-hidden rounded-lg shadow-lg">
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                    width="100%"
                />
            </div>
        </div>)}
    </div>);
}
