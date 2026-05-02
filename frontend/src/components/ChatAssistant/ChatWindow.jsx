import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ChatBubble from './ChatBubble';
import StarterChips from './StarterChips';
import { useChat } from '../../hooks/useChat';
import './Assistant.css';

const ChatWindow = ({ initialQuery, countryContext = '' }) => {
  const [inputText, setInputText] = useState(initialQuery || '');
  const { messages, sendMessage, isLoading, error } = useChat(countryContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Track the last query we auto-sent, so each new suggestion triggers correctly
  const lastSentQuery = useRef(null);
  useEffect(() => {
    if (initialQuery && initialQuery !== lastSentQuery.current && messages.length > 0 && !isLoading) {
      lastSentQuery.current = initialQuery;
      sendMessage(initialQuery);
      setInputText('');
    }
  }, [initialQuery, messages.length, sendMessage, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleStarterChip = (text) => {
    sendMessage(text);
  };

  return (
    <div className="chat-window card">
      <div className="chat-header">
        <h2>ElectIQ Assistant</h2>
        <p>Ask anything about election processes or voting eligibility.</p>
      </div>

      <div className="chat-messages-area">
        {messages.map((msg, idx) => (
          <ChatBubble key={msg.id || idx} message={msg} />
        ))}
        
        {isLoading && (
          <div className="chat-bubble-wrapper assistant">
            <div className="chat-avatar">
              <Loader2 size={20} className="spinner" />
            </div>
            <div className="chat-bubble loading">
              <span className="dot-typing"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && !isLoading && (
        <StarterChips onSelect={handleStarterChip} />
      )}

      {error && <div className="chat-error">{error}</div>}

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          className="btn btn-primary send-btn"
          disabled={isLoading || !inputText.trim()}
          aria-label="Send message"
        >
          {isLoading ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
