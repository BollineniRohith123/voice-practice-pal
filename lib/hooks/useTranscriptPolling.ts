import { useState, useEffect, useRef } from 'react';

export interface Message {
  role: string;
  text: string;
  medium: string;
  callStageMessageIndex: number;
  callStageId: string;
}

interface TranscriptResponse {
  results: Message[];
  total: number;
  next: string | null;
  previous: string | null;
}

export function useTranscriptPolling(callId: string | null, isActive: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastMessageIndexRef = useRef<number>(-1);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchTranscripts = async () => {
      if (!callId || !isActive) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/ultravox/messages?callId=${callId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transcripts');
        }

        const data: TranscriptResponse = await response.json();
        
        // Only update if we have new messages
        if (data.results.length > lastMessageIndexRef.current + 1) {
          // Get only new messages
          const newMessages = data.results.slice(lastMessageIndexRef.current + 1);
          lastMessageIndexRef.current = data.results.length - 1;
          
          setMessages(prevMessages => [...prevMessages, ...newMessages]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transcripts');
        console.error('Error fetching transcripts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isActive && callId) {
      // Initial fetch
      fetchTranscripts();
      
      // Set up polling every 2 seconds
      intervalId = setInterval(fetchTranscripts, 2000);
    } else {
      // Reset state when call ends or callId changes
      lastMessageIndexRef.current = -1;
      setMessages([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [callId, isActive]);

  return {
    messages,
    error,
    isLoading
  };
}