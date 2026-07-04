export default function ChatArea() {
  return (
    <main className="chat-area">
      <div className="chat-area__header">Chat</div>
      <div className="chat-area__messages" aria-label="Chat messages">
        {/* Placeholder content */}
        <div className="placeholder">No messages yet</div>
      </div>
      <div className="chat-area__composer" aria-label="Message composer">
        <input
          className="composer__input"
          placeholder="Type a message..."
          disabled
        />
        <button className="composer__send" type="button" disabled>
          Send
        </button>
      </div>
    </main>
  );
}

