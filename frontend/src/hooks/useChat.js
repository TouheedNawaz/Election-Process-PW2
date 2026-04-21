import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { sendChatMessage } from '../services/api';

export const useChat = (countryContext = '') => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Anonymous Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        const uid = userCredential.user.uid;
        
        // Use a daily session or just the UID as the session base
        // For hackathon simplicity, we'll just use their UID as the session ID
        const sid = uid;
        setSessionId(sid);

        // Ensure session doc exists
        await setDoc(doc(db, 'sessions', sid), {
          createdAt: serverTimestamp(),
          country: countryContext || 'general',
          lastActive: serverTimestamp()
        }, { merge: true });

        // Listen for messages in this session
        const messagesRef = collection(db, 'sessions', sid, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Only set messages if we have some, otherwise add a greeting
          if (msgs.length > 0) {
            setMessages(msgs);
          } else {
            // Local greeting, not saved to DB to save reads/writes
            setMessages([
              {
                id: 'greeting',
                role: 'assistant',
                content: `Hi! I'm ElectIQ. How can I help you understand the election process${countryContext ? ` in ${countryContext}` : ''}?`,
                timestamp: new Date()
              }
            ]);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Auth/Firestore Error:", err);
        setError("Failed to initialize chat session.");
      }
    };

    initSession();
  }, [countryContext]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const messagesRef = collection(db, 'sessions', sessionId, 'messages');

      // 1. Save user message to Firestore
      await addDoc(messagesRef, {
        role: 'user',
        content: text,
        timestamp: serverTimestamp()
      });

      // 2. Format history for context (last 5 messages to save tokens)
      const historyForApi = messages
        .filter(m => m.id !== 'greeting')
        .slice(-5)
        .map(m => ({ role: m.role, content: m.content }));

      // 3. Call backend API
      const reply = await sendChatMessage(text, countryContext, historyForApi);

      // 4. Save AI response to Firestore
      await addDoc(messagesRef, {
        role: 'assistant',
        content: reply,
        timestamp: serverTimestamp()
      });

    } catch (err) {
      console.error("Chat Error:", err);
      setError("Failed to send message or receive reply.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, messages, countryContext]);

  return {
    messages,
    sendMessage,
    isLoading,
    error
  };
};
