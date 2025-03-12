'use client';

import { MOCK_QUESTIONS, CLINICAL_SCENARIOS, Question, ClinicalScenario } from '@/lib/constants';
import { useState } from 'react';

interface Props {
  topic: string;
  onClose: () => void;
}

export default function InterviewModule({ topic, onClose }: Props) {
  const [selectedType, setSelectedType] = useState<'questions' | 'scenarios'>('questions');
  
  // Filter questions and scenarios by topic
  const filteredQuestions = MOCK_QUESTIONS.filter(q => q.topic === topic);
  const filteredScenarios = CLINICAL_SCENARIOS.filter(s => s.topic === topic);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Practice Module</h2>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setSelectedType('questions')}
                className={`px-4 py-2 text-sm ${
                  selectedType === 'questions'
                    ? 'bg-deep-purple text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setSelectedType('scenarios')}
                className={`px-4 py-2 text-sm ${
                  selectedType === 'scenarios'
                    ? 'bg-deep-purple text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Scenarios
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {selectedType === 'questions' ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Practice Questions</h3>
              {filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                  {filteredQuestions.map((question: Question, index: number) => (
                    <div 
                      key={question.id}
                      className="p-4 rounded-lg border hover:border-deep-purple cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Question {index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-800">{question.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No practice questions available for this topic.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Clinical Scenarios</h3>
              {filteredScenarios.length > 0 ? (
                <div className="space-y-4">
                  {filteredScenarios.map((scenario: ClinicalScenario, index: number) => (
                    <div 
                      key={scenario.id}
                      className="p-4 rounded-lg border hover:border-deep-purple cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-deep-purple">{scenario.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          scenario.complexity === 'low' ? 'bg-green-100 text-green-800' :
                          scenario.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {scenario.complexity} complexity
                        </span>
                      </div>
                      <p className="text-gray-700">{scenario.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No clinical scenarios available for this topic.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
