import { UltravoxClient, UltravoxClientOptions } from '@fixie-ai/ultravox-client';

/**
 * Interface for Ultravox API call configuration
 */
export interface CallConfig {
  systemPrompt: string;
  voice?: string;
  model?: string;
  temperature?: number;
  recordingEnabled?: boolean;
  firstSpeaker?: string;
}

/**
 * Interface for voice session configuration
 */
export interface VoiceSessionConfig {
  apiKey: string;
  voiceId: string;
  systemPrompt: string;
  model?: string;
}

/**
 * Enum for message roles
 */
export enum MessageRole {
  USER = 'user',
  AGENT = 'assistant'
}

/**
 * Interface for message response
 */
export interface Message {
  role: MessageRole;
  content: string;
  text?: string;  // Optional for backward compatibility
  timestamp?: string;
}

/**
 * Interface for voice interaction state
 */
export interface VoiceInteractionState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}

/**
 * Type for voice interaction status
 */
export type VoiceInteractionStatus = 
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

/**
 * Interface for transcript response
 */
export interface TranscriptResponse {
  results: Message[];
  total: number;
  next: string | null;
  previous: string | null;
}

/**
 * Interface for voice status
 */
export type VoiceStatus = 'idle' | 'speaking' | 'listening';

/**
 * Topic interface for consistency across components
 */
export interface Topic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  icon: string;
  systemPrompt?: string;
}

/**
 * Interview data interface for storing session information
 */
export interface InterviewData {
  candidate: {
    name: string;
    position: string;
    years_of_experience: number;
  };
  session: {
    timestamp: string;
    startTime: number;
    duration: number;
    completed_categories: string[];
  };
  qa_history: Array<{
    question: string;
    answer: string;
    category: string;
    score?: number;
  }>;
  progress: {
    completed_categories: string[];
    current_category: string;
    questions_remaining: number;
    average_score: number;
  };
  technical_evaluation: {
    category_scores: Record<string, {
      score: number;
      questions: number;
    }>;
    overall_score: number;
  };
  final_evaluation: {
    technical_score: number;
    recommendation: {
      hire_recommendation: boolean;
      justification: string;
    };
  };
}