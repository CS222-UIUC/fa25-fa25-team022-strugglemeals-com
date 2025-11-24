import { useState, useEffect } from "react";
import "./ChatWindow.css";

export default function ChatWindow({ open, onClose, recipe }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState(true);

  // RESET UI whenever the chat opens with a NEW recipe
  useEffect(() => {
    if (open && recipe) {
      setMessages([
        { sender: "bot", text: `Hi! I'm ChefBot. Ready to cook ${recipe.title}?` }
      ]);
      setFirstMessage(true);   // VERY IMPORTANT
    }
  }, [open, recipe]);

  if (!open) return null;

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          recipe: firstMessage ? recipe : null   // <-- only send recipe ONCE
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Error getting reply";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setFirstMessage(false);   // After first send, stop sending recipe
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong talking to ChefBot." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="chatwindow-overlay">
      <div className="chatwindow-box">
        <div className="chatwindow-header">
          <h3>ChefBot</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="chatwindow-messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-msg ${m.sender === "user" ? "user" : "bot"}`}
            >
              {m.text}
            </div>
          ))}
          {loading && <div className="loading">...</div>}
        </div>

        <div className="chatwindow-input">
          <input
            value={input}
            placeholder="Ask something..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
