'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { startCall, endCall } from '@/lib/callFunctions';
import demoConfig from '@/app/demo-config';
import { Role, Transcript } from 'ultravox-client';
import CallStatus from '@/components/CallStatus';
import MicToggleButton from '@/components/MicToggleButton';
import { PhoneOffIcon } from 'lucide-react';
import OrderDetails from '@/components/OrderDetails';
import ProductDisplay from '@/components/ProductDisplay';

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  const handleStartCallButtonClick = useCallback(async () => {
    try {
      await startCall(
        {
          onStatusChange: (status) => setAgentStatus(status),
          onTranscriptChange: (transcripts) => setCallTranscript(transcripts),
          onDebugMessage: (msg) => console.log('Debug:', msg)
        },
        demoConfig.callConfig,
        true
      );
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to start call:', error);
      setAgentStatus('error');
    }
  }, []);

  const handleEndCallButtonClick = useCallback(async () => {
    try {
      await endCall();
      setIsCallActive(false);
      setAgentStatus('off');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{demoConfig.title}</h1>
          <p className="text-lg text-gray-600">{demoConfig.overview}</p>
        </div>

        {/* Product Display */}
        <div className="mb-8">
          <ProductDisplay />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {isCallActive ? (
              <>
                <div className="mb-6">
                  <div 
                    ref={transcriptContainerRef}
                    className="h-[300px] overflow-y-auto bg-gray-50 rounded-lg p-4"
                  >
                    {callTranscript && callTranscript.map((transcript, index) => (
                      <div key={index} className={`mb-4 ${transcript.speaker === 'agent' ? 'text-blue-600' : 'text-gray-700'}`}>
                        <p className="text-sm text-gray-500">{transcript.speaker === 'agent' ? "Dr. Donut" : "You"}</p>
                        <p className="mt-1">{transcript.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <MicToggleButton role={Role.USER} />
                  <button
                    onClick={handleEndCallButtonClick}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <PhoneOffIcon className="w-5 h-5 mr-2" />
                      End Call
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleStartCallButtonClick}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
                >
                  Start Order
                </button>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg">
            <OrderDetails />
          </div>
        </div>
      </div>
    </div>
  );
}