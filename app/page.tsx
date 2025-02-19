'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { startCall, endCall } from '@/lib/callFunctions';
import { demoConfig } from '@/app/demo-config';
import ProductDisplay from '@/app/components/ProductDisplay';
import OrderDetails from '@/app/components/OrderDetails';
import { Transcript } from 'ultravox-client';

export default function Home() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);

  const handleStartCall = async () => {
    try {
      await startCall(
        {
          onTranscriptChange: (newTranscripts) => setTranscripts(newTranscripts || []),
          onStatusChange: (newStatus) => setStatus(newStatus),
          onDebugMessage: (msg) => console.log('Debug:', msg)
        },
        demoConfig.callConfig,
        true
      );
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setIsCallActive(false);
      setStatus('');
      setTranscripts([]);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-900 text-center py-4">
            Dr. Donut Drive-Thru
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Section - Menu (70%) */}
          <div className="w-[70%]">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ProductDisplay />
            </div>
          </div>

          {/* Right Section - Order & Drive-Thru (30%) */}
          <div className="w-[30%] space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Order</h2>
              <OrderDetails />
            </div>

            {/* Drive-Thru Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Drive-Thru Speaker</h2>
              
              {/* Call Controls */}
              <div className="mb-4">
                {!isCallActive ? (
                  <button
                    onClick={handleStartCall}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Start Order
                  </button>
                ) : (
                  <button
                    onClick={handleEndCall}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    End Order
                  </button>
                )}
              </div>

              {/* Conversation */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Conversation</h3>
                <div className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  {transcripts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                      Start your order by clicking the button above!
                    </p>
                  ) : (
                    transcripts.map((transcript, index) => (
                      <div 
                        key={index} 
                        className={`mb-2 text-sm ${
                          transcript.speaker === 'agent' 
                            ? 'text-blue-600' 
                            : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xs text-gray-500">
                          {transcript.speaker === 'agent' ? 'Dr. Donut:' : 'You:'}
                        </span>
                        <span className="ml-2">{transcript.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}