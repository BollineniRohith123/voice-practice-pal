'use client';
import React, { useState, useEffect } from 'react';
import { Transcript } from 'ultravox-client';

interface InterviewFeedbackProps {
  language: string;
  transcripts: Transcript[];
}

export const InterviewFeedback: React.FC<InterviewFeedbackProps> = ({ language, transcripts }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [animateScore, setAnimateScore] = useState(false);
  
  // Simulate feedback generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      // Start score animation after analysis is complete
      setTimeout(() => setAnimateScore(true), 200);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simple word count metric from user responses
  const userWords = transcripts
    .filter(t => t.speaker !== 'agent')
    .reduce((acc, t) => acc + t.text.split(' ').length, 0);
  
  // Count of user responses
  const userResponseCount = transcripts.filter(t => t.speaker !== 'agent').length;
  
  // Average response length
  const avgResponseLength = userResponseCount > 0 
    ? Math.round(userWords / userResponseCount) 
    : 0;
  
  // Mock feedback scores
  const getScore = () => {
    if (userWords > 200) return { score: 85, text: 'Excellent', description: 'Outstanding technical knowledge and communication' };
    if (userWords > 100) return { score: 70, text: 'Good', description: 'Solid understanding of core concepts' };
    return { score: 50, text: 'Needs Improvement', description: 'More detailed responses recommended' };
  };
  
  const score = getScore();
  
  // Animated loading state
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative w-20 h-20">
          {/* Pulsing circles */}
          <div className="absolute inset-0 rounded-full bg-medium-purple/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-medium-purple/40 animate-ping animation-delay-300"></div>
          <div className="absolute inset-4 rounded-full bg-medium-purple/60 animate-ping animation-delay-600"></div>
          
          {/* Loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-lavender rounded-full border-t-medium-purple animate-spin"></div>
          </div>
        </div>
        
        <p className="mt-6 text-medium-purple font-medium animate-pulse">
          Analyzing interview performance...
        </p>
        <div className="w-48 h-1.5 bg-lavender/50 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-medium-purple animate-progress"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gradient-purple mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Interview Feedback
      </h2>
      
      {/* Overall score card with animated circular progress */}
      <div className="bg-gradient-to-br from-lavender/70 to-lavender/30 p-5 rounded-lg border border-medium-purple/30 shadow-sm">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#E6E6FA" 
                strokeWidth="8"
              />
              
              {/* Animated progress circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#8A2BE2" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${animateScore ? score.score * 2.83 : 0}, 283`}
                strokeDashoffset="0"
                transform="rotate(-90, 50, 50)"
                style={{ 
                  transition: animateScore ? "stroke-dasharray 1.5s ease-in-out" : "none"
                }}
              />
              
              <text 
                x="50" 
                y="50" 
                fontFamily="sans-serif" 
                fontSize="20" 
                textAnchor="middle" 
                alignmentBaseline="central" 
                fill="#4B0082"
                fontWeight="bold"
                className={animateScore ? "animate-[fadeIn_1s_ease-in]" : "opacity-0"}
              >
                {score.score}%
              </text>
            </svg>
            
            {/* Decorative stars for high scores */}
            {score.score > 70 && (
              <>
                <span className="absolute -top-1 -right-1 text-xl animate-[bounce_2s_ease_infinite]">⭐</span>
                {score.score > 80 && (
                  <span className="absolute -bottom-1 -left-1 text-lg animate-[bounce_2.3s_ease_infinite]">⭐</span>
                )}
              </>
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h3 className={`text-2xl font-bold text-deep-purple mb-1 ${animateScore ? "animate-[fadeInUp_0.7s_ease-out]" : "opacity-0"}`}>
              {score.text}
            </h3>
            <p className={`text-sm text-medium-purple ${animateScore ? "animate-[fadeInUp_0.9s_ease-out]" : "opacity-0"}`}>
              {score.description}
            </p>
            
            {/* Dynamic feedback tag based on score */}
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              score.score > 80 
                ? 'bg-green-100 text-green-800'
                : score.score > 65
                ? 'bg-blue-100 text-blue-800'
                : 'bg-orange-100 text-orange-800'
            } ${animateScore ? "animate-[fadeInUp_1.1s_ease-out]" : "opacity-0"}`}>
              {score.score > 80 
                ? 'Top performer'
                : score.score > 65
                ? 'Strong candidate'
                : 'Potential with practice'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics with animated counters */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {[
          { label: "Total Words", value: userWords, icon: "📝", color: "from-deep-purple/10 to-lavender", delay: 0 },
          { label: "Responses", value: userResponseCount, icon: "💬", color: "from-soft-blue/10 to-lavender", delay: 200 }, 
          { label: "Avg. Length", value: `${avgResponseLength} words`, icon: "📊", color: "from-salmon/10 to-lavender", delay: 400 },
          { label: "Language", value: language, icon: "💻", color: "from-accent-yellow/10 to-lavender", delay: 600 }
        ].map((metric, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${metric.color} p-4 rounded-lg border border-lavender shadow-sm 
              hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]
              animate-[fadeInUp_0.5s_ease-out]`}
            style={{ animationDelay: `${metric.delay}ms` }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-xl mr-3">
                {metric.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-medium-purple uppercase tracking-wider">{metric.label}</p>
                <p className="text-lg font-bold text-deep-purple capitalize">
                  {typeof metric.value === 'number' ? 
                    <span className="counter">{metric.value}</span> : 
                    metric.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Key observations with animated appearance */}
      <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-lg p-5 border border-lavender">
        <h3 className="text-lg font-medium text-deep-purple mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Key Observations
        </h3>
        
        <ul className="space-y-3">
          {[
            userResponseCount > 5 
              ? 'Good engagement with multiple detailed responses' 
              : 'Consider providing more detailed answers to technical questions',
            avgResponseLength > 15 
              ? 'Well-articulated responses with good technical depth' 
              : 'Responses could benefit from more technical detail and examples',
            'Continue practicing with coding challenges to improve problem-solving skills'
          ].map((observation, index) => (
            <li key={index} className="animate-[fadeInLeft_0.5s_ease-out]" style={{ animationDelay: `${300 + index * 200}ms` }}>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-medium-purple/20 flex items-center justify-center mt-0.5 mr-3">
                  <svg className="h-3 w-3 text-deep-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-medium-purple text-sm">{observation}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Next steps with animation */}
      <div className="mt-6 p-5 bg-gradient-to-br from-soft-blue/10 to-lavender/30 rounded-lg border border-lavender/50 shadow-inner animate-[fadeIn_1s_ease-in]">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-deep-purple flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-deep-purple">Next Steps</h3>
        </div>
        
        <div className="ml-11">
          <p className="text-sm text-medium-purple mb-3">
            Try another interview with a different language or review the transcript to identify areas for improvement.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="bg-medium-purple text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-deep-purple transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Review Transcript
            </button>
            
            <button className="bg-salmon text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:opacity-90 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Try Another Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};