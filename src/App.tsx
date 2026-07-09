import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="chat-app">
      {/* ── Header ── */}
      <header className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.2l6 3.3v6.9l-6-3.3V9.2zm8 10.2v-6.9l6-3.3v6.7l-6 3.5z" />
            </svg>
          </div>
          <h1 className="chat-title">AI Assistant</h1>
        </div>
        {messages.length > 0 && (
          <button className="clear-btn" onClick={clearChat} title="New chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>New chat</span>
          </button>
        )}
      </header>

      {/* ── Messages ── */}
      <main className="chat-messages">
        <div className="chat-messages-inner">
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.2l6 3.3v6.9l-6-3.3V9.2zm8 10.2v-6.9l6-3.3v6.7l-6 3.5z" />
                </svg>
              </div>
              <h2>What can I help with?</h2>
              <p>Ask me anything to get started.</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="message-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.2l6 3.3v6.9l-6-3.3V9.2zm8 10.2v-6.9l6-3.3v6.7l-6 3.5z" />
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
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row assistant">
              <div className="message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.2l6 3.3v6.9l-6-3.3V9.2zm8 10.2v-6.9l6-3.3v6.7l-6 3.5z" />
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
        </div>
      </main>

      {/* ── Input ── */}
      <footer className="chat-footer">
        <div className="chat-footer-inner">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Assistant…"
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              title="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
          <p className="input-hint">AI Assistant can make mistakes. Consider checking important information.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
