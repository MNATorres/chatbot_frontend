import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import useChat from './hooks/useChat';
import './App.css';

function App() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-app">
      {/* ── Header ── */}
      <header className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 10.5h-.5V8c0-2.76-2.24-5-5-5h-7C5.74 3 3.5 5.24 3.5 8v2.5H3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h.5V16c0 2.76 2.24 5 5 5h7c2.76 0 5-2.24 5-5v-2.5h.5c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zM9 13.5c-.83 0-1.5-.67-1.5-1.5S8.17 10.5 9 10.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <div>
            <h1 className="chat-title">AI Assistant</h1>
            <span className="chat-status">
              <span className="status-dot" />
              Online
            </span>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        )}
      </header>

      {/* ── Messages ── */}
      <main className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" opacity="0.7" />
              </svg>
            </div>
            <h2>How can I help you?</h2>
            <p>Start a conversation with the AI assistant</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message-wrapper ${message.role}`}>
            {message.role === 'assistant' && (
              <div className="message-avatar bot">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 10.5h-.5V8c0-2.76-2.24-5-5-5h-7C5.74 3 3.5 5.24 3.5 8v2.5H3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h.5V16c0 2.76 2.24 5 5 5h7c2.76 0 5-2.24 5-5v-2.5h.5c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zM9 13.5c-.83 0-1.5-.67-1.5-1.5S8.17 10.5 9 10.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
            )}
            <div className="message-content">
              <div className={`message-bubble ${message.role}`}>
                {message.role === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            {message.role === 'user' && (
              <div className="message-avatar user">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-avatar bot">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 10.5h-.5V8c0-2.76-2.24-5-5-5h-7C5.74 3 3.5 5.24 3.5 8v2.5H3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h.5V16c0 2.76 2.24 5 5 5h7c2.76 0 5-2.24 5-5v-2.5h.5c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zM9 13.5c-.83 0-1.5-.67-1.5-1.5S8.17 10.5 9 10.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <div className="message-content">
              <div className="message-bubble assistant typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ── Input ── */}
      <footer className="chat-footer">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="input-hint">AI can make mistakes. Verify important information.</p>
      </footer>
    </div>
  );
}

export default App;
