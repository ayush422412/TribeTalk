// components/RightContent.tsx (FIXED - string channel IDs)

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { useMessages } from "../hooks/useMessages"

const RightContent = () => {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get active channel ID from Redux (now string | null)
  const activeChannelId = useSelector(
    (state: RootState) => state.channel.activeChannelId
  )

  // Get messages and send function
  const { messages, sendMessage } = useMessages(activeChannelId)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    sendMessage(messageInput.trim())
    setMessageInput("")
  }

  // No channel selected
  if (!activeChannelId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Select a channel to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No messages yet. Be the first to send one!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-gray-800 p-3 rounded">
              <div className="flex items-baseline gap-2">
                <span className="text-blue-400 font-semibold">
                  User {msg.senderId}
                </span>
                <span className="text-xs text-gray-500">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                </span>
              </div>
              <p className="text-gray-200 mt-1">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default RightContent