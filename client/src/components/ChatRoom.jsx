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
    socket.on("typing", (username) => setTypingUser(username));
    socket.on("stopTyping", () => setTypingUser(""));

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
    if (!chat.trim()) return;
    socket.emit("sendMessage", chat);
    setChat("");
  };

  useEffect(() => {
    msgRef.current?.scrollTo({ top: msgRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">{room.name}</h2>

      <div
        className="h-64 overflow-y-auto border rounded-md p-2 bg-gradient-to-br from-gray-50 to-indigo-100 space-y-2"
        ref={msgRef}
      >
        {chatMessages.map((msg, index) => {
          const isCurrentUser = msg.sender?.username === user.username;
          return (
            <div
              key={msg._id || index}
              className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-lg shadow-md text-sm ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-bl-none"
                    : "bg-gray-300 text-gray-900 rounded-br-none"
                }`}
              >
                <div className="font-semibold mb-1">{msg.sender?.username}</div>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      {typingUser && typingUser !== user.username && (
        <div className="mt-1 text-sm text-gray-600 italic">{typingUser} is typing...</div>
      )}

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a Message..."
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
