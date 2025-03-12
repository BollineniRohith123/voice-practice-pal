'use client';
import React, { useState, useEffect } from 'react';
import { startCall, endCall } from '@/lib/callFunctions';
import { demoConfig, createDemoConfig } from './demo-config';
import { Transcript, Role, Medium } from 'ultravox-client';
import { MEDICAL_TOPICS } from '@/lib/constants';
import { storeInterviewData, analyzeInterview, InterviewData, extractRatingsFromAnalysis } from '@/lib/groqAnalysis';
import InterviewAnalysisDashboard from '@/app/components/InterviewAnalysisDashboard';
import ApiKeyInput from '@/app/components/ApiKeyInput';

export default function Home() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [callId, setCallId] = useState<string>('');
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [interviewAnalysis, setInterviewAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedName, setExtractedName] = useState<string>("Student");
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);

  // Handle real-time transcript updates directly from the session
  const handleTranscriptUpdate = (newTranscripts: Transcript[] | undefined) => {
    if (newTranscripts) {
      // Filter out any function calls or technical details
      const filteredTranscripts = newTranscripts.map(transcript => {
        const cleanedTranscript = { ...transcript };
        if (cleanedTranscript.text) {
          cleanedTranscript.text = cleanedTranscript.text
            .replace(/\{\"type\"\s*:\s*\"function\"[^}]*\}\}/g, '')
            .replace(/\{\"function\"[^}]*\}\}/g, '')
            .replace(/captureVivaVoceData[^}]*\}/g, '')
            .replace(/\s+/g, ' ').trim();
        }
        return cleanedTranscript;
      });
      
      setTranscripts(filteredTranscripts);
    }
  };

  const handleStartCall = async () => {
    if (!selectedTopic || !isApiKeyValid) {
      alert('Please select a medical specialty and provide a valid API key');
      return;
    }
    
    try {
      setStatus('Initializing assessment...');
      
      const customConfig = createDemoConfig(selectedTopic.toLowerCase());
      
      const updatedConfig = {
        systemPrompt: customConfig.callConfig.systemPrompt,
        model: demoConfig.callConfig.model || 'fixie-ai/ultravox-70B',
        languageHint: 'en',
        maxDuration: '3600s',
        timeExceededMessage: 'Assessment session has exceeded the maximum duration.',
        temperature: demoConfig.callConfig.temperature,
        voice: demoConfig.callConfig.voice,
        selectedTools: demoConfig.callConfig.selectedTools
      };
      
      const callId = await startCall(
        {
          onTranscriptChange: handleTranscriptUpdate,
          onStatusChange: (newStatus) => {
            const statusText = newStatus || '';
            setStatus(statusText);
            
            if (statusText.toLowerCase().includes('error')) {
              console.error('Call status error:', statusText);
              setIsCallActive(false);
              alert('Error during assessment: ' + statusText);
            } else if (statusText.toLowerCase().includes('connected') || 
                      statusText.toLowerCase() === 'connected' || 
                      statusText.toLowerCase() === 'in_call' || 
                      statusText === 'IN_CALL') {
              setIsCallActive(true);
            }
          },
          onDebugMessage: (msg) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Debug:', msg);
            }
          }
        },
        updatedConfig,
        process.env.NODE_ENV === 'development'
      );
      
      setCallId(callId);
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to start assessment:', error);
      setStatus('Failed to start assessment');
      setIsCallActive(false);
      
      let errorMessage = 'Failed to start assessment. ';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += 'There is a configuration issue. Please contact support.';
        } else {
          errorMessage += error.message;
        }
      }
      alert(errorMessage);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setIsCallActive(false);
      setStatus('');
      
      // Only fetch messages once after call has ended
      if (callId) {
        try {
          setIsAnalyzing(true);
          
          const storedApiKey = localStorage.getItem('security_key');
          const response = await fetch(`/api/ultravox/messages?callId=${callId}`, {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': storedApiKey || '',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Extract student name from messages
          const nameMessage = data.results.find((msg: any) => 
            msg.text.toLowerCase().includes('my name is') || 
            msg.text.toLowerCase().includes('i am') || 
            msg.text.toLowerCase().includes("i'm")
          );
          
          if (nameMessage) {
            const nameParts = nameMessage.text.match(/(?:my name is|i am|i'm)\s+(\w+)/i);
            if (nameParts && nameParts[1]) {
              setExtractedName(nameParts[1]);
            }
          }
          
          setInterviewData(data);
          storeInterviewData(data);
          
          if (selectedTopic) {
            const analysis = await analyzeInterview(data, selectedTopic);
            setInterviewAnalysis(analysis);
          }
        } catch (error) {
          console.error('Error processing final call data:', error);
          alert('Failed to process interview data. Please try again.');
        } finally {
          setIsAnalyzing(false);
          setShowFeedback(true);
        }
      }
    } catch (error) {
      console.error('Failed to end assessment:', error);
      setIsCallActive(false);
      setShowFeedback(true);
    }
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setShowFeedback(false);
    setInterviewAnalysis('');
    if (isCallActive) {
      handleEndCall();
    }
  };

  useEffect(() => {
    const handleCallEnded = () => {
      setIsCallActive(false);
    };

    window.addEventListener('callEnded', handleCallEnded);
    return () => {
      window.removeEventListener('callEnded', handleCallEnded);
    };
  }, []);

  // Show analysis dashboard if feedback is ready
  if (showFeedback && interviewAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
          <h1 className="text-xl md:text-2xl font-semibold text-gradient-purple">Assessment Results</h1>
          <div className="flex items-center gap-4">
            {isAnalyzing && (
              <div className="flex items-center text-medium-purple">
                <div className="animate-spin mr-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
                <span className="text-sm">Analyzing responses...</span>
              </div>
            )}
            <button 
              onClick={() => {
                setShowFeedback(false);
                setInterviewAnalysis('');
                setSelectedTopic('');
                setInterviewData(null);
              }}
              className="text-medium-purple hover:text-deep-purple transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start New Assessment
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <InterviewAnalysisDashboard
            analysis={interviewAnalysis}
            ratings={extractRatingsFromAnalysis(interviewAnalysis)}
            candidateName={extractedName}
            language={selectedTopic}
          />
        </div>
      </div>
    );
  }

  // If we're in the active call screen
  if (isCallActive) {
    return (
      <ActiveSessionView 
        topicName={MEDICAL_TOPICS.find(t => t.id === selectedTopic)?.name || ""}
        onEndCall={handleEndCall}
        transcripts={transcripts}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold text-gradient-purple">Viva Voce Practice</h1>
          <div className="px-2.5 py-1 bg-gradient-to-r from-deep-purple/10 to-medium-purple/10 text-deep-purple text-xs font-medium rounded-md">BETA</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <ApiKeyInput 
            onApiKeyChange={(key, isValid) => setIsApiKeyValid(isValid)}
          />
        </div>
        
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Perfect your <span className="text-gradient-purple">Viva Voce</span> skills
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
            Select a medical topic below and practice responding to exam questions verbally,
            just like in your real Viva Voce assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {MEDICAL_TOPICS.map((topic) => (
            <TopicCard
              key={topic.id}
              icon={topic.icon}
              title={topic.name}
              description={topic.description}
              questionCount={topic.questionCount}
              selected={selectedTopic === topic.id}
              onClick={() => handleTopicSelect(topic.id)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleStartCall}
            disabled={!selectedTopic || !isApiKeyValid}
            className={`flex items-center justify-center px-8 py-4 rounded-full text-white font-medium text-lg
              shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
              selectedTopic && isApiKeyValid
                ? 'bg-gradient-to-r from-deep-purple to-medium-purple hover:from-deep-purple/90 hover:to-medium-purple/90' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {!isApiKeyValid ? 'Please Enter Security Key' : !selectedTopic ? 'Select a Topic' : 'Start Practice Session'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-8 mt-12 border-t px-4">
        Designed for junior doctors to practice Viva Voce exams with confidence
      </footer>
    </div>
  );
}

// Topic Card Component
function TopicCard({ 
  icon, 
  title, 
  description, 
  questionCount, 
  selected, 
  onClick 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  questionCount: number; 
  selected: boolean; 
  onClick: () => void; 
}) {
  return (
    <div 
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg 
        transform hover:-translate-y-1 ${
        selected 
          ? 'border-deep-purple ring-2 ring-deep-purple/20 bg-gradient-to-br from-white to-lavender/30' 
          : 'border-gray-200 hover:border-medium-purple glass-effect'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <span className="text-4xl filter drop-shadow-md">{icon}</span>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-deep-purple">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{description}</p>
        <div className="text-sm font-medium text-medium-purple flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {questionCount} questions
        </div>
      </div>
    </div>
  );
}

// Active Session View
function ActiveSessionView({ 
  topicName, 
  onEndCall,
  transcripts
}: { 
  topicName: string; 
  onEndCall: () => void;
  transcripts: Transcript[];
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-medium">{topicName}</h1>
        </div>
        <div className="px-2 py-1 bg-gray-200 text-xs rounded-md">BETA</div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-lg shadow p-4 mb-4 h-[400px] overflow-y-auto">
            {transcripts.map((transcript, index) => (
              <div 
                key={index} 
                className={`mb-4 ${transcript.speaker === Role.USER ? 'text-right' : ''}`}
              >
                <div className={`inline-block p-3 rounded-lg ${
                  transcript.speaker === Role.USER 
                    ? 'bg-deep-purple text-white' 
                    : 'bg-gray-100'
                }`}>
                  {transcript.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={onEndCall}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              End Call
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
