import { useState, useCallback } from 'react';
import useFetch from './useFetch';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Conversation key for the backend's memory: messages sharing a session_id
  // share history server-side (last 8 messages, 30 min inactivity TTL).
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const { post } = useFetch();

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await post<{ answer: string }>('/ask', {
          message: trimmed,
          session_id: sessionId,
        });

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, post, sessionId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    // Fresh session_id so the backend starts a brand-new conversation too —
    // otherwise "New chat" would only clear the screen, not the memory.
    setSessionId(crypto.randomUUID());
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
};

export default useChat;
