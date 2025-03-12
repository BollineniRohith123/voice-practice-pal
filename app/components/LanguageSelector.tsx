'use client';
import React, { useState } from 'react';

interface Topic {
  id: string;
  name: string;
}

interface TopicSelectorProps {
  languages: Topic[]; // Keeping the prop name for compatibility
  selectedLanguage: string; // Keeping the prop name for compatibility
  onSelectLanguage: (topic: string) => void; // Keeping the prop name for compatibility
  disabled?: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  languages, 
  selectedLanguage, 
  onSelectLanguage,
  disabled = false
}) => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  
  // Medical topic icons with custom styling
  const topicIcons: Record<string, { icon: string, bgClass: string, shadowClass: string }> = {
    'cardiology': {
      icon: '❤️',
      bgClass: 'bg-gradient-to-br from-red-100 to-pink-50',
      shadowClass: 'shadow-red-200'
    },
    'neurology': {
      icon: '🧠',
      bgClass: 'bg-gradient-to-br from-purple-100 to-indigo-50',
      shadowClass: 'shadow-purple-200'
    },
    'pediatrics': {
      icon: '👶',
      bgClass: 'bg-gradient-to-br from-blue-100 to-cyan-50',
      shadowClass: 'shadow-blue-200'
    },
    'emergency-medicine': {
      icon: '🚑',
      bgClass: 'bg-gradient-to-br from-amber-100 to-yellow-50',
      shadowClass: 'shadow-amber-200'
    }
  };
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Perfect your <span className="text-blue-600">Viva Voce</span> skills</h1>
        <p className="text-gray-600 text-lg">
          Select a medical topic below and practice responding to exam questions verbally,
          just like in your real Viva Voce assessment.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {languages.map((topic) => {
          const isSelected = selectedLanguage === topic.id;
          const isHovered = hoveredTopic === topic.id;
          const iconStyle = topicIcons[topic.id] || { 
            icon: '🏥', 
            bgClass: 'bg-gradient-to-br from-gray-100 to-gray-50',
            shadowClass: 'shadow-gray-200'
          };
          const questionCount = topic.id === 'cardiology' ? 10 : 
                              topic.id === 'respiratory-medicine' ? 8 :
                              topic.id === 'pediatrics' ? 11 :
                              topic.id === 'emergency-medicine' ? 12 : 
                              topic.id === 'neurology' ? 9 :
                              topic.id === 'general-surgery' ? 10 : 10;
          
          return (
            <button
              key={topic.id}
              onClick={() => onSelectLanguage(topic.id)}
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`
                relative group flex flex-col p-6 rounded-xl border 
                transition-all duration-300 bg-white
                ${isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                  : 'border-gray-200 hover:border-blue-500'}
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'}
                focus:outline-none
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-deep-purple text-white text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              
              {/* Topic icon with animated background */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{iconStyle.icon}</div>
                <div className="text-sm text-gray-500">{questionCount} questions</div>
              </div>
              
              {/* Topic name with highlight effect on selected */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg text-gray-900">{topic.name}</h3>
                <p className="text-sm text-gray-500">
                  {topic.id === 'cardiology' ? 'Heart conditions, ECG interpretation, and cardiac emergencies' :
                   topic.id === 'respiratory-medicine' ? 'Lung diseases, respiratory function, and ventilation management' :
                   topic.id === 'pediatrics' ? 'Child development, pediatric conditions, and care approaches' :
                   topic.id === 'emergency-medicine' ? 'Trauma, critical care, and emergency procedures' :
                   topic.id === 'neurology' ? 'Neurological assessments, disorders, and treatments' :
                   topic.id === 'general-surgery' ? 'Surgical principles, procedures, and post-operative care' :
                   'Medical assessment and treatment'}
                </p>
              </div>
              
              {/* Little decorative element */}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-t-full bg-medium-purple"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected topic indicator */}
      {selectedLanguage && (
        <div className="mt-6 px-4 py-2 bg-neutral-bg/50 border border-lavender rounded-lg inline-block animate-[fadeIn_0.5s_ease]">
          <span className="text-xs uppercase tracking-wide text-deep-purple font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {languages.find(topic => topic.id === selectedLanguage)?.name} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default TopicSelector;