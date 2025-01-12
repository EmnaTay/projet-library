import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { baseUrl, userContext } from "./App";
import { getCsrf } from "./Auth";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the chat
    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input
    setUserInput("");

    try {
      // Send message to backend
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      if (response.ok) {
        // Add bot response to the chat
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          sender: "bot",
          text: data.error || "Error occurred.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Unable to contact the server.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chat-app">
      <header className="header">
        <h1>Chatbot Universitaire</h1>
      </header>
      <div className="main-content">
        <div className="chat-container">
          <div id="chat-box" className="chat-box">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <strong>
                  {message.sender === "user" ? "Vous" : "Chatbot"}:
                </strong>{" "}
                {message.text}
              </div>
            ))}
          </div>
          <textarea
            id="user-input"
            rows="3"
            placeholder="Écrivez votre message ici..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          ></textarea>
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
