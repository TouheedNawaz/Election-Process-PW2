import React from 'react';
import { Bot, User } from 'lucide-react';
import './Assistant.css';

const formatMessage = (content) => {
  // Very basic markdown formatting for bold and lists
  // Since we don't have a full markdown parser in this hackathon version,
  // we'll handle basic line breaks and bolding natively.
  
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  
  return paragraphs.map((paragraph, index) => {
    // Check if it's a list item
    if (paragraph.trim().startsWith('* ') || paragraph.trim().startsWith('- ')) {
      const text = paragraph.trim().substring(2);
      return <li key={index} dangerouslySetInnerHTML={{ __html: renderBold(text) }} />;
    }
    
    // Check if it's a numbered list item
    if (/^\d+\.\s/.test(paragraph.trim())) {
      const text = paragraph.trim().replace(/^\d+\.\s/, '');
      return <li key={index} dangerouslySetInnerHTML={{ __html: renderBold(text) }} style={{listStyleType: 'decimal', marginLeft: '1rem'}} />;
    }

    return <p key={index} dangerouslySetInnerHTML={{ __html: renderBold(paragraph) }} />;
  });
};

const renderBold = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const ChatBubble = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`chat-bubble-wrapper ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="chat-avatar">
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="chat-bubble">
        <div className="chat-content">
          {formatMessage(message.content)}
        </div>
        {message.timestamp && (
          <span className="chat-timestamp">
             {message.timestamp.toDate ? 
                message.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                : new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
