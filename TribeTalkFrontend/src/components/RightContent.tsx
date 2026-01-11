import  { useState } from "react";
import { useRightContent } from "../hooks/useRightContent";

const RightContent = () => {
  const { activeServer, activeChannel, messages, sendMessage } = useRightContent();
  const [newMessage, setNewMessage] = useState("");

  if (!activeServer || !activeChannel) {
    return <h1 className="p-4">Select a server and channel</h1>;
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage, 1); // Replace 1 with actual user ID
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-xl font-bold mb-4">
        {activeServer.name} / #{activeChannel.name}
      </h1>

      <div className="flex-1 overflow-y-auto border p-2 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RightContent;
