import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CallConfig, VoiceSessionConfig, Message } from './types';

// Use proxy endpoint for local development
const ULTRAVOX_API_BASE = '/api/ultravox'; 
const API_KEY = import.meta.env.VITE_ULTRAVOX_API_KEY;

// Specific voice ID provided by the user
const PROFESSIONAL_MEDICAL_VOICE = '91fa9bcf-93c8-467c-8b29-973720e3f167';

if (!API_KEY) {
  console.error('❌ CRITICAL: Ultravox API key is not set. Please check your .env file.');
  throw new Error('Ultravox API key is missing. Set VITE_ULTRAVOX_API_KEY in your .env file.');
}

/**
 * Enhanced logging function for debugging API interactions
 */
function logApiInteraction(stage: string, details: any) {
  console.group(`🔍 Ultravox API Interaction: ${stage}`);
  console.log(JSON.stringify(details, null, 2));
  console.groupEnd();
}

/**
 * Create a voice interaction session
 */
export async function createVoiceSession(config: VoiceSessionConfig): Promise<{ sessionId: string; joinUrl: string }> {
  try {
    logApiInteraction('Creating Voice Session', { config });

    const sessionConfig = {
      systemPrompt: config.systemPrompt,
      voiceId: config.voiceId || PROFESSIONAL_MEDICAL_VOICE,
      model: config.model || 'fixie-ai/ultravox-70B'
    };

    const response = await fetch(`${ULTRAVOX_API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'VoicePracticePal/1.0',
      },
      body: JSON.stringify(sessionConfig),
    });

    logApiInteraction('Session Response', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Voice Session Creation Error:', errorText);
      throw new Error(`Session Creation Failed: ${errorText}`);
    }

    const sessionData = await response.json();

    logApiInteraction('Successful Session Creation', {
      sessionId: sessionData.sessionId,
      joinUrl: sessionData.joinUrl
    });

    return {
      sessionId: sessionData.sessionId,
      joinUrl: sessionData.joinUrl
    };
  } catch (error) {
    console.error('❌ Voice Session Interaction Error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Sanitize and validate the call configuration
 */
export function sanitizeCallConfig(config: Partial<CallConfig>): CallConfig {
  logApiInteraction('Configuration Input', { inputConfig: config });

  // Validate system prompt
  if (!config.systemPrompt) {
    throw new Error('❌ System prompt is REQUIRED for Ultravox interaction');
  }

  // Comprehensive configuration with fallbacks
  const sanitizedBody: CallConfig = {
    systemPrompt: config.systemPrompt,
    voice: PROFESSIONAL_MEDICAL_VOICE,
    model: config.model || 'fixie-ai/ultravox-70B',
    temperature: config.temperature || 0.7,
    recordingEnabled: true,
    firstSpeaker: 'FIRST_SPEAKER_AGENT'
  };

  logApiInteraction('Sanitized Configuration', { sanitizedConfig: sanitizedBody });
  return sanitizedBody;
}

/**
 * Starts a new call session with the Ultravox API
 */
export async function startCall(config: CallConfig): Promise<{ callId: string; joinUrl: string }> {
  try {
    // Sanitize and validate the configuration
    const sanitizedConfig = sanitizeCallConfig(config);

    logApiInteraction('Call Initiation', {
      apiBase: ULTRAVOX_API_BASE,
      apiKeyPrefix: API_KEY ? API_KEY.substring(0, 5) : 'NO_KEY',
      voiceId: sanitizedConfig.voice
    });

    const response = await fetch(`${ULTRAVOX_API_BASE}/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'VoicePracticePal/1.0',
      },
      body: JSON.stringify(sanitizedConfig),
    });

    logApiInteraction('Raw Response', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ultravox API Error:', errorText);
      
      throw new Error(`API Call Failed: ${errorText}`);
    }

    const data = await response.json();
    
    logApiInteraction('Successful Call Creation', {
      callId: data.callId,
      joinUrl: data.joinUrl
    });

    return {
      callId: data.callId,
      joinUrl: data.joinUrl,
    };
  } catch (error) {
    console.error('❌ Detailed Ultravox Interaction Error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

/**
 * Helper function to handle API responses with enhanced error logging
 */
async function handleResponse<T>(response: Response): Promise<T> {
  console.group('🔍 Ultravox API Response Details');
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Full Error Response:', errorText);
    console.groupEnd();

    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.details || errorJson.error || errorJson.message || errorText;
    } catch {
      // Use raw error text if parsing fails
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log('✅ Response Data:', data);
  console.groupEnd();
  
  return data;
}

/**
 * Fetches messages from a specific call session
 */
export async function getCallMessages(callId: string): Promise<{ 
  results: Message[]; 
  total: number; 
  next: string | null; 
  previous: string | null;
}> {
  try {
    const response = await fetch(`${ULTRAVOX_API_BASE}/calls/${callId}/messages`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Get call messages response details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const data = await handleResponse<any>(response);
    
    return {
      results: data.results || [],
      total: data.total || data.results?.length || 0,
      next: data.next || null,
      previous: data.previous || null,
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

/**
 * Custom hook for transcript polling
 */
export function useTranscriptPolling(
  callId: string | null,
  isActive: boolean
): {
  messages: Message[];
  error: string | null;
  isLoading: boolean;
} {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    if (!callId || !isActive) {
      return;
    }

    setIsLoading(true);
    
    // Reset state when callId changes
    setMessages([]);
    setError(null);
    
    const intervalId = setInterval(async () => {
      try {
        const response = await getCallMessages(callId);
        console.log('Get call messages response:', response);
        // Only update if we have new messages
        if (response.results.length > messages.length) {
          setMessages(response.results);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
      } finally {
        setIsLoading(false);
      }
    }, 2000); // Poll every 2 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [callId, isActive, messages.length]);
  
  return { messages, error, isLoading };
}

/**
 * Microphone permission and device detection utility
 */
export async function checkMicrophoneAccess(): Promise<{
  hasPermission: boolean;
  devices: MediaDeviceInfo[];
  error?: string;
}> {
  try {
    // Check for microphone devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(device => device.kind === 'audioinput');

    if (audioInputDevices.length === 0) {
      console.error('❌ No microphone devices found');
      return {
        hasPermission: false,
        devices: [],
        error: 'No microphone devices detected'
      };
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    console.log('✅ Microphone Access Granted');
    console.log('Microphone Devices:', audioInputDevices.map(device => device.label));

    // Close the stream after checking
    stream.getTracks().forEach(track => track.stop());

    return {
      hasPermission: true,
      devices: audioInputDevices
    };
  } catch (error) {
    console.error('❌ Microphone Access Error:', error);
    return {
      hasPermission: false,
      devices: [],
      error: error.message
    };
  }
}

/**
 * Hook to manage microphone state and access
 */
export function useMicrophoneCheck() {
  const [microphoneStatus, setMicrophoneStatus] = useState({
    hasPermission: false,
    devices: [],
    error: null
  });

  useEffect(() => {
    const checkMicrophone = async () => {
      const status = await checkMicrophoneAccess();
      setMicrophoneStatus(status);
    };

    checkMicrophone();
  }, []);

  return microphoneStatus;
}

export default startCall;
