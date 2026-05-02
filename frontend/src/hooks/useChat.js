import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, query, orderBy,
  getDocs, serverTimestamp, doc, setDoc
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { streamChatMessage } from '../services/api';

// Fallback local ID when Firebase is unavailable
const makeLocalId = () => `local-${Math.random().toString(36).slice(2, 9)}`;

const makeGreeting = (ctx) => ({
  id: 'greeting',
  role: 'assistant',
  content: `Hi! I'm ElectIQ. How can I help you understand the election process${ctx ? ` in ${ctx}` : ''}?`,
  timestamp: new Date()
});

export const useChat = (countryContext = '') => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  // On mount (or country change): authenticate and load history ONCE.
  // We use getDocs (one-time read) instead of onSnapshot (live listener)
  // to avoid race conditions where Firestore overwrites in-progress streaming state.
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const credential = await signInAnonymously(auth);
        if (cancelled) return;

        const sid = credential.user.uid;
        setSessionId(sid);

        // Upsert session document
        await setDoc(doc(db, 'sessions', sid), {
          country: countryContext || 'general',
          lastActive: serverTimestamp()
        }, { merge: true });

        if (cancelled) return;

        // Load existing messages once (no live listener)
        const messagesRef = collection(db, 'sessions', sid, 'messages');
        const snapshot = await getDocs(query(messagesRef, orderBy('timestamp', 'asc')));

        if (cancelled) return;

        const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(msgs.length > 0 ? msgs : [makeGreeting(countryContext)]);
      } catch (err) {
        if (cancelled) return;
        // Firebase unavailable → local mode (no persistence, full functionality)
        console.warn('Firebase unavailable, switching to local mode:', err.code || err.message);
        setSessionId(makeLocalId());
        setMessages([makeGreeting(countryContext)]);
      }
    };

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryContext]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !sessionId) return;

    setIsLoading(true);
    setError(null);
    const streamingId = `streaming-${Date.now()}`;

    try {
      // Immediately add user bubble + empty AI streaming bubble to local state
      const userMsg = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [
        ...prev,
        userMsg,
        { id: streamingId, role: 'assistant', content: '', timestamp: new Date(), streaming: true }
      ]);

      // Build history from current local state (last 5 turns, skip greeting/streaming)
      const historyForApi = messages
        .filter(m => m.id !== 'greeting' && !m.streaming)
        .slice(-5)
        .map(m => ({ role: m.role, content: m.content }));

      // Stream tokens from Gemini — each token updates the streaming bubble
      const fullReply = await streamChatMessage(
        text,
        countryContext,
        historyForApi,
        (_token, accumulated) => {
          setMessages(prev =>
            prev.map(m => m.id === streamingId ? { ...m, content: accumulated } : m)
          );
        }
      );

      // Swap streaming bubble → final persisted bubble
      const aiMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: fullReply,
        timestamp: new Date()
      };
      setMessages(prev => [
        ...prev.filter(m => m.id !== streamingId),
        aiMsg
      ]);

      // Persist to Firestore in background (fire-and-forget; not critical for UI)
      if (!sessionId.startsWith('local-')) {
        const messagesRef = collection(db, 'sessions', sessionId, 'messages');
        addDoc(messagesRef, { role: 'user', content: text, timestamp: serverTimestamp() }).catch(console.warn);
        addDoc(messagesRef, { role: 'assistant', content: fullReply, timestamp: serverTimestamp() }).catch(console.warn);
      }
    } catch (err) {
      console.error('Chat Error:', err);
      // Remove broken streaming bubble on failure
      setMessages(prev => prev.filter(m => m.id !== streamingId));
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, messages, countryContext]);

  return { messages, sendMessage, isLoading, error };
};
