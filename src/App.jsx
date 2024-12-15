// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3333");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Real-Time Chat
        </h1>

        <div className="h-80 overflow-y-scroll mb-4 p-3 border border-gray-300 rounded-md">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 mb-2 bg-blue-100 rounded">
              <span>{msg}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
