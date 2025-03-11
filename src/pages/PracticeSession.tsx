import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PhoneOff, RefreshCw, Mic, MicOff, Info } from 'lucide-react';
import Header from '@/components/Header';
import VoiceIndicator from '@/components/VoiceIndicator';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startCall, useTranscriptPolling } from '@/lib/ultravox-api';
import { Topic, VoiceStatus, Message, MessageRole } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

// Function to enhance system prompts with advanced conversation behavior
const enhanceSystemPrompt = (topicPrompt: string, examinerName: string = "Dr. Thompson"): string => {
  // Base conversation rules for more human-like AI behavior
  const conversationRules = `
  # CONVERSATION BEHAVIOR RULES - PRIORITY GUIDELINES
  1. NATURAL CONVERSATIONAL FLOW: Speak naturally as an experienced medical examiner would.
  2. NO REPETITION: Never repeat the student's words back to them verbatim.
  3. BRIEF ACKNOWLEDGMENT: Briefly acknowledge answers with variations like "I see", "Interesting", "Good point" before continuing.
  4. DIRECT QUESTIONING: Move directly to your next question without summarizing what was just said.
  5. LISTENING INDICATORS: Demonstrate active listening through brief acknowledgments.
  6. INTERRUPTION AWARENESS: If you sense the student is still speaking, pause and allow them to continue.
  7. ONE QUESTION AT A TIME: Ask only one question at a time and wait for a complete response.
  
  # BRIEF UTTERANCE HANDLING
  1. CONTINUE LISTENING: When students respond with brief utterances like "Hmm", "Ah", "OK", or similar, do not consider these as complete responses.
  2. WAIT FOR PAUSES: Only consider the student's turn complete after a significant pause.
  3. PATIENCE REQUIRED: Give students ample time to formulate their complete thoughts.
  
  # EXAMINER PERSONA
  You are ${examinerName}, an experienced medical examiner with extensive clinical experience and academic knowledge.
  Your demeanor is professional but not cold - you are evaluating the student fairly while creating a realistic examination environment.
  You remember details the student has shared and may reference them appropriately later in the examination.
  
  # INTRODUCTION BEHAVIOR
  Begin by introducing yourself as ${examinerName} and the examination topic clearly and briefly.
  Set expectations for the examination and ask your first question.
  
  # FEEDBACK STYLE
  Provide concise, specific feedback after each answer that identifies strengths and areas for improvement.
  Be constructive but realistic - this is a formal examination scenario.
  
  # REMEMBER: These behavioral guidelines are strictly for your internal use.
  The student should experience a natural, realistic medical viva voce examination.
  `;

  // Combine the topic-specific prompt with the conversation rules
  return topicPrompt + "\n\n" + conversationRules;
};

// Mock data for topics with enhanced prompts
const TOPICS: Topic[] = [
  {
    id: "cardiology",
    title: "Cardiology",
    description: "Heart conditions, ECG interpretation, and cardiac emergencies",
    questionCount: 10,
    icon: "❤️",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on cardiology. 
    Ask challenging questions about heart conditions, ECG interpretation, and cardiac emergencies one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 10 questions covering various aspects of cardiology.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Carter")
  },
  {
    id: "respiratory",
    title: "Respiratory Medicine",
    description: "Lung diseases, respiratory function, and ventilation management",
    questionCount: 8,
    icon: "🫁",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on respiratory medicine. 
    Ask challenging questions about lung diseases, respiratory function, and ventilation management one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 8 questions covering various aspects of respiratory medicine.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Patel")
  },
  {
    id: "emergency",
    title: "Emergency Medicine",
    description: "Trauma, critical care, and emergency procedures",
    questionCount: 12,
    icon: "🚑",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on emergency medicine. 
    Ask challenging questions about trauma, critical care, and emergency procedures one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 12 questions covering various aspects of emergency medicine.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Rodriguez")
  },
  {
    id: "neurology",
    title: "Neurology",
    description: "Neurological assessments, disorders, and treatments",
    questionCount: 9,
    icon: "🧠",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on neurology. 
    Ask challenging questions about neurological assessments, disorders, and treatments one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 9 questions covering various aspects of neurology.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Nelson")
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Child development, pediatric conditions, and care approaches",
    questionCount: 11,
    icon: "👶",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on pediatrics. 
    Ask challenging questions about child development, pediatric conditions, and care approaches one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 11 questions covering various aspects of pediatrics.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Chen")
  },
  {
    id: "surgery",
    title: "General Surgery",
    description: "Surgical principles, procedures, and post-operative care",
    questionCount: 10,
    icon: "🔪",
    systemPrompt: enhanceSystemPrompt(`You are an experienced medical examiner conducting a viva voce exam for a junior doctor on general surgery. 
    Ask challenging questions about surgical principles, procedures, and post-operative care one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 10 questions covering various aspects of general surgery.
    Be professional, insightful, and evaluate responses as an expert examiner would.`, "Dr. Johnson")
  }
];

// Enhanced question count detection that better handles conversation patterns
const getQuestionCount = (messages: Message[]): number => {
  // Filter for agent messages that likely contain questions
  const agentMessages = messages.filter(msg => msg.role === MessageRole.AGENT);
  
  // More sophisticated question detection
  let questionCount = 0;
  let previousMessageWasFeedback = false;
  
  for (const msg of agentMessages) {
    const text = msg.text.toLowerCase();
    
    // Check for question marks
    if (msg.text.includes('?')) {
      // Don't count clarification questions in the same turn
      if (!previousMessageWasFeedback || !text.match(/^(could you|can you|would you|do you mind)/i)) {
        questionCount++;
      }
      previousMessageWasFeedback = false;
    } 
    // Detect feedback patterns
    else if (text.match(/^(good|excellent|nice|well done|correct|that's right|i agree|interesting)/i)) {
      previousMessageWasFeedback = true;
    } else {
      previousMessageWasFeedback = false;
    }
  }
  
  // Return at least 1 if we have messages but haven't detected questions yet
  return agentMessages.length > 0 && questionCount === 0 ? 1 : questionCount;
};

// Track conversation state for better voice interactions
type ConversationState = 'idle' | 'agentSpeaking' | 'userSpeaking' | 'thinking' | 'listeningForMore';

// Connection states for better UI feedback
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

const PracticeSession = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [animateIn, setAnimateIn] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [isCallStarting, setIsCallStarting] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [lastUserUtterance, setLastUserUtterance] = useState<number>(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  
  // Maximum retry attempts
  const MAX_RETRIES = 3;
  
  // Use the transcript polling hook
  const { messages, error, isLoading } = useTranscriptPolling(callId, sessionActive);
  
  // Current question count based on transcript messages
  const currentQuestion = messages.length > 0 ? getQuestionCount(messages) : 1;
  
  // Reference to store session data for results
  const sessionDataRef = useRef({
    messages: [] as Message[],
    topic: null as Topic | null,
    startTime: Date.now(),
    conversationMetrics: {
      userSpeakingTime: 0,
      agentSpeakingTime: 0,
      turnsCount: 0,
      averageResponseTime: 0,
      connectionIssues: 0,
    }
  });
  
  // Find the current topic based on URL param
  useEffect(() => {
    const topic = TOPICS.find(t => t.id === topicId) || null;
    setCurrentTopic(topic);
    
    if (topic) {
      sessionDataRef.current.topic = topic;
    }
    
    setAnimateIn(true);

    // Check for microphone permissions on component mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setMicrophoneEnabled(true))
        .catch(() => {
          setMicrophoneEnabled(false);
          toast({
            title: "Microphone access denied",
            description: "Please enable microphone access to use this application.",
            variant: "destructive",
          });
        });
    }
  }, [topicId, toast]);
  
  // Start the call when the component mounts
  useEffect(() => {
    if (currentTopic && !callId && !isCallStarting && microphoneEnabled) {
      startSession();
    }
  }, [currentTopic, microphoneEnabled]);

  // Enhanced startSession method with comprehensive error handling
  const startSession = async () => {
    if (!currentTopic) {
      toast({
        title: "Error",
        description: "No topic selected. Please choose a topic first.",
        variant: "destructive"
      });
      return;
    }

    setIsCallStarting(true);
    setConnectionState('connecting');

    try {
      // Validate API key
      const apiKey = import.meta.env.VITE_ULTRAVOX_API_KEY;
      if (!apiKey || apiKey.length < 10) {
        throw new Error('Invalid or missing Ultravox API key');
      }

      // Prepare call configuration
      const callConfig = {
        systemPrompt: currentTopic.systemPrompt,
        temperature: 0.7, // Moderate creativity
        model: 'fixie-ai/ultravox-70B', // Specify model
        voice: 'professional_medical', // Optional: specify voice
        languageHint: 'en-US', // Language for the conversation
        recordingEnabled: true,
        firstSpeaker: 'FIRST_SPEAKER_AGENT',
        maxDuration: '3600s', // 1-hour maximum session
        transcriptOptional: false,
        medium: {
          serverWebSocket: {
            inputSampleRate: 16000,
            outputSampleRate: 16000,
            clientBufferSizeMs: 100
          }
        },
        metadata: {
          customer_id: 'practice_session',
          source: 'medical_viva_voce',
          department: currentTopic.title
        }
      };

      // Start the call
      const { callId, joinUrl } = await startCall(callConfig);

      // Update session state
      setCallId(callId);
      setJoinUrl(joinUrl);
      setSessionActive(true);
      setConnectionState('connected');
      setAnimateIn(true);

      // Log successful call start
      console.log(`Call started successfully. Call ID: ${callId}`);

      // Optional: Show success toast
      toast({
        title: "Session Started",
        description: `Medical viva voce session for ${currentTopic.title} has begun.`
      });

    } catch (error) {
      // Comprehensive error handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error('Session start failed:', errorMessage);
      
      // Detailed error toast
      toast({
        title: "Session Start Failed",
        description: `Unable to start session: ${errorMessage}`,
        variant: "destructive"
      });

      // Reset connection state
      setConnectionState('failed');
      setIsCallStarting(false);

      // Increment retry count for potential automatic retry
      setRetryCount(prev => prev + 1);
    }
  };

  // Retry mechanism
  useEffect(() => {
    if (retryCount > 0 && retryCount <= MAX_RETRIES) {
      const retryTimeout = setTimeout(() => {
        startSession();
      }, 2000 * retryCount); // Exponential backoff

      return () => clearTimeout(retryTimeout);
    }
  }, [retryCount]);

  // Handle connection errors and implement retry logic
  useEffect(() => {
    if (error && sessionActive) {
      setConnectionState('reconnecting');
      sessionDataRef.current.conversationMetrics.connectionIssues++;
      
      if (retryCount < MAX_RETRIES) {
        const timer = setTimeout(() => {
          // Attempt to reconnect
          setRetryCount(prev => prev + 1);
          
          toast({
            title: "Reconnecting...",
            description: `Attempting to restore connection (${retryCount + 1}/${MAX_RETRIES})`,
            duration: 3000,
          });
          
          // Re-poll for messages
          setSessionActive(true);
          
        }, 3000); // Wait 3 seconds before retrying
        
        return () => clearTimeout(timer);
      } else {
        setConnectionState('failed');
        toast({
          title: "Connection failed",
          description: "Unable to reconnect after multiple attempts. You may try ending the call and starting a new session.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } else if (!error && messages.length > 0) {
      setConnectionState('connected');
      setRetryCount(0); // Reset retry count on successful connection
    }
  }, [error, retryCount, messages.length, sessionActive, toast]);
  
  // Advanced conversation state management
  useEffect(() => {
    if (messages.length > 0) {
      sessionDataRef.current.messages = messages;
      
      // Determine voice status and conversation state based on message patterns
      const latestMessage = messages[messages.length - 1];
      const prevMessage = messages.length > 1 ? messages[messages.length - 2] : null;
      const now = Date.now();
      
      // Handle conversation state transitions
      if (latestMessage.role === MessageRole.AGENT) {
        setVoiceStatus('speaking');
        setConversationState('agentSpeaking');
        
        // Update turn counts for metrics
        sessionDataRef.current.conversationMetrics.turnsCount += 1;
        
      } else if (latestMessage.role === MessageRole.USER) {
        // Check if this is a brief utterance
        const isShortResponse = latestMessage.text.split(' ').length <= 3;
        
        if (isShortResponse && now - lastUserUtterance < 3000) {
          // This might be a thinking noise or brief acknowledgment
          setConversationState('listeningForMore');
          setVoiceStatus('idle');
        } else {
          setVoiceStatus('idle');
          setConversationState('idle');
          
          // Calculate response times for metrics
          if (prevMessage && prevMessage.role === MessageRole.AGENT) {
            const responseTime = now - new Date(prevMessage.timestamp).getTime();
            const currentAvg = sessionDataRef.current.conversationMetrics.averageResponseTime;
            const currentTurns = sessionDataRef.current.conversationMetrics.turnsCount;
            
            // Update average response time
            sessionDataRef.current.conversationMetrics.averageResponseTime = 
              (currentAvg * (currentTurns - 1) + responseTime) / currentTurns;
          }
        }
        
        setLastUserUtterance(now);
      }
    }
  }, [messages, lastUserUtterance]);
  
  // Manually retry connection
  const handleRetryConnection = () => {
    if (connectionState === 'failed') {
      setRetryCount(0);
      setConnectionState('connecting');
      startSession();
    }
  };
  
  const handleEndCall = () => {
    // Store final session data for results
    const sessionData = {
      ...sessionDataRef.current,
      endTime: Date.now(),
      messages: messages,
    };
    
    // Store in sessionStorage for results page to access
    sessionStorage.setItem('practiceSessionData', JSON.stringify(sessionData));
    
    toast({
      title: "Session ended",
      description: "Preparing your results...",
      duration: 3000,
    });
    
    // Navigate to results
    navigate(`/results/${topicId}`);
  };
  
  const handleEndSession = () => {
    if (sessionActive) {
      const confirmExit = window.confirm("Are you sure you want to end this session? Your progress will be lost.");
      if (confirmExit) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };
  
  // Check for browser compatibility
  const isBrowserCompatible = () => {
    return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  };
  
  if (!currentTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }
  
  if (!isBrowserCompatible()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Browser Not Supported</h2>
        <p className="text-center mb-6">
          Your browser doesn't support the required audio features. 
          Please use a modern browser like Chrome, Firefox, or Edge.
        </p>
        <Button onClick={() => navigate('/')} size="lg">
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <Header 
        showBackButton={true} 
        title={currentTopic.title} 
      />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <ProgressBar 
              current={currentQuestion} 
              total={currentTopic.questionCount} 
            />
          </div>
          
          {/* Connection Status Display */}
          {connectionState === 'connecting' && (
            <Alert className="mb-4 animate-pulse">
              <AlertDescription className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Connecting to your examiner...
              </AlertDescription>
            </Alert>
          )}
          
          {connectionState === 'reconnecting' && (
            <Alert className="mb-4 animate-pulse">
              <AlertDescription className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Reconnecting... ({retryCount}/{MAX_RETRIES})
              </AlertDescription>
            </Alert>
          )}
          
          {connectionState === 'failed' && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription className="flex flex-col gap-2">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Connection failed. Please retry or start a new session.
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryConnection}
                  className="self-end mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {!microphoneEnabled && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <MicOff className="h-4 w-4" />
                Microphone access is required. Please enable it in your browser settings.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-scale-in">
            <VoiceIndicator status={voiceStatus} />
            
            {/* Microphone status indicator */}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {microphoneEnabled ? (
                <>
                  <Mic className="h-3 w-3" />
                  <span>Microphone active</span>
                </>
              ) : (
                <>
                  <MicOff className="h-3 w-3" />
                  <span>Microphone disabled</span>
                </>
              )}
            </div>
            
            {isLoading && connectionState === 'connecting' && (
              <p className="mt-4 text-muted-foreground animate-pulse">
                Connecting to your examiner...
              </p>
            )}
            
            {sessionActive && messages.length > 0 && (
              <div className="mt-6 text-center max-w-md px-4">
                <p className={`${messages[messages.length - 1].role === MessageRole.AGENT ? 'font-medium' : 'text-muted-foreground italic'}`}>
                  {messages[messages.length - 1].text}
                </p>
              </div>
            )}
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} mt-8 animate-slide-up`}>
            <Button
              variant="outline"
              size={isMobile ? "default" : "lg"}
              onClick={handleEndSession}
              className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              <X className="h-4 w-4" />
              Cancel Session
            </Button>
            
            <Button
              size={isMobile ? "default" : "lg"}
              onClick={handleEndCall}
              disabled={!sessionActive || connectionState === 'failed'}
              variant="destructive"
              className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              <PhoneOff className="h-4 w-4" />
              End Call
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-muted-foreground text-sm max-w-md mx-auto animate-fade-in">
          <p>
            Speak clearly into your microphone. When you've finished the interview, 
            click "End Call" to see your results and feedback.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PracticeSession;
