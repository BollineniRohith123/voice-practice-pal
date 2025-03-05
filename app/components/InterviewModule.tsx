'use client';
import React, { useState, useEffect } from 'react';
import { MOCK_QUESTIONS, CODING_CHALLENGES } from '@/lib/constants';

interface InterviewModuleProps {
  language: string;
  isActive: boolean;
}

const InterviewModule: React.FC<InterviewModuleProps> = ({ language, isActive }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'challenges'>('overview');
  
  // Reset tab when language changes
  useEffect(() => {
    setSelectedTab('overview');
  }, [language]);
  
  const questions = MOCK_QUESTIONS[language as keyof typeof MOCK_QUESTIONS] || [];
  const challenges = CODING_CHALLENGES[language as keyof typeof CODING_CHALLENGES] || [];
  
  const renderLanguageIcon = () => {
    switch(language) {
      case 'python': return '🐍';
      case 'java': return '☕';
      case 'javascript': return '📜';
      case 'csharp': return '#️⃣';
      default: return '💻';
    }
  };
  
  const getLanguageDisplay = () => {
    switch(language) {
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'javascript': return 'JavaScript';
      case 'csharp': return 'C#';
      default: return language;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-3xl">{renderLanguageIcon()}</span>
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            {getLanguageDisplay()} Interview
          </h2>
          <p className="text-sm text-gray-500">
            {isActive 
              ? "Interview in progress - speak clearly and take your time to answer questions"
              : 'Ready to start - click the "Start Interview" button to begin'}
          </p>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 -mb-px" aria-label="Tabs">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm
              ${selectedTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Language Overview
          </button>
          <button
            onClick={() => setSelectedTab('challenges')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm
              ${selectedTab === 'challenges'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Coding Challenges
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-4">
        {selectedTab === 'overview' ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Common Interview Questions</h3>
              <ul className="space-y-3 list-disc pl-5">
                {questions.map((question, index) => (
                  <li key={index} className="text-gray-700">{question}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-2">Interview Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Explain your thought process clearly as you work through problems</li>
                <li>Ask clarifying questions if you're unsure about requirements</li>
                <li>Discuss trade-offs in your solutions</li>
                <li>Be honest if you don't know something, and explain how you would find the answer</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Coding Challenges</h3>
            
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium text-gray-900">{challenge.title}</h4>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : ''}
                      ${challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${challenge.difficulty === 'advanced' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{challenge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewModule;
