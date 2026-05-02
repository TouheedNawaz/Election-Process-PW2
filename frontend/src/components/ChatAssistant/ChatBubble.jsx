import React from 'react';
import SimpleMarkdown from '../SimpleMarkdown';
import { Bot, User } from 'lucide-react';
import './Assistant.css';

const ChatBubble = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const content = message.content || '';

  return (
    <div className={`chat-bubble-wrapper ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="chat-avatar">
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="chat-bubble">
        <div className="chat-content">
          {isAssistant ? (
            content.trim().length > 0
              ? <SimpleMarkdown className="markdown-body">{content}</SimpleMarkdown>
              : <span className="dot-typing" />
          ) : (
            <p>{content}</p>
          )}
        </div>
        {message.timestamp && !message.streaming && (
          <span className="chat-timestamp">
            {message.timestamp.toDate
              ? message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
