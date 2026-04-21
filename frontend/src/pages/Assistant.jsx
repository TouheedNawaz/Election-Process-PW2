import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatWindow from '../components/ChatAssistant/ChatWindow';
import '../components/ChatAssistant/Assistant.css';

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="assistant-page container">
      <ChatWindow initialQuery={query} />
    </div>
  );
};

export default Assistant;
