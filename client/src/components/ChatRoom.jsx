import { useEffect, useRef, useState } from "react";

export default function ChatRoom({ room, messages, user, socket }) {
  const [chat, setChat] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [chatMessages, setChatMessages] = useState(messages || []);
  const msgRef = useRef(null);

  useEffect(() => {
    setChatMessages(messages || []);
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleNewMessage);

    socket.on("typing", (username) => {
      setTypingUser(username);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  const handleTyping = () => {
    socket.emit("typing");
    setTimeout(() => socket.emit("stopTyping"), 1000);
  };

  const handleSend = () => {
    socket.emit("sendMessage", chat);
    setChat("");
  };

  return (
    <div>
      <h2 className="text-2xl mb-2">{room.name}</h2>
      <div className="h-64 overflow-y-auto border mb-2 bg-gray-50" ref={msgRef}>
        {chatMessages.map((msg) => (
          <p key={msg._id || Math.random()}>
            <strong>{msg.sender?.username}</strong> {msg.content}
          </p>
        ))}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        {typingUser && `${typingUser} is typing ...`}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a Message..."
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
