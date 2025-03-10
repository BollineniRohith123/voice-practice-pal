'use client';

import React from 'react';
import { InterviewRatings } from '@/lib/groqAnalysis';

interface InterviewAnalysisDashboardProps {
  analysis: string;
  ratings: InterviewRatings;
  candidateName?: string;
  language: string;
}

const InterviewAnalysisDashboard: React.FC<InterviewAnalysisDashboardProps> = ({ 
  analysis, 
  ratings, 
  candidateName = "Candidate", 
  language 
}) => {
  // Helper function to determine background color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Helper function to determine recommendation badge color
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire': return 'bg-green-100 text-green-800 border-green-200';
      case 'Consider': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Do Not Recommend': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Parse sections from analysis text
  const getSection = (title: string): string => {
    const regex = new RegExp(`${title}[:\\s]+(.*?)(?=\\n\\n|\\n[A-Z]|$)`, 's');
    const match = analysis.match(regex);
    return match ? match[1].trim() : '';
  };

  const overallImpression = getSection('Overall impression');
  const technicalAssessment = getSection('Technical knowledge assessment');
  const communicationSkills = getSection('Communication skills evaluation');
  const areasOfStrength = getSection('Areas of strength');
  const areasForImprovement = getSection('Areas for improvement');
  const suggestedQuestions = getSection('Suggested follow-up questions');
  const finalRecommendation = getSection('Final recommendation');

  return (
    <div className="space-y-6 animate-[fadeIn_0.6s_ease-in]">
      {/* Header with candidate name and final recommendation */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gradient-purple">
          Interview Analysis: {candidateName}
        </h2>
        <div className={`px-3 py-1 rounded-full border ${getRecommendationColor(ratings.recommendation)} text-sm font-medium`}>
          {ratings.recommendation}
        </div>
      </div>
      
      {/* Overall score in a large circular display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              className="stroke-current text-lavender/50"
              fill="none"
              strokeWidth="4"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-current text-medium-purple"
              fill="none"
              strokeWidth="4"
              strokeDasharray={`${ratings.overallScore}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="fill-current text-deep-purple text-3xl font-bold" textAnchor="middle">
              {ratings.overallScore}%
            </text>
          </svg>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-lavender/80 text-white text-xs px-3 py-1 rounded-full">
            Overall Score
          </div>
        </div>
      </div>
      
      {/* Detailed score bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Technical Score */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-deep-purple">Technical Score</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.technicalScore}%</span>
          </div>
          <div className="w-full bg-lavender/30 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(ratings.technicalScore)}`} 
              style={{ width: `${ratings.technicalScore}%` }}
            ></div>
          </div>
        </div>
        
        {/* Communication Score */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-deep-purple">Communication</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.communicationScore}%</span>
          </div>
          <div className="w-full bg-lavender/30 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(ratings.communicationScore)}`} 
              style={{ width: `${ratings.communicationScore}%` }}
            ></div>
          </div>
        </div>
        
        {/* Problem-Solving Score */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-deep-purple">Problem Solving</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.problemSolving}%</span>
          </div>
          <div className="w-full bg-lavender/30 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(ratings.problemSolving)}`} 
              style={{ width: `${ratings.problemSolving}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Language and interview details */}
      <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-deep-purple flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-deep-purple">Interview Details</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 ml-11">
          <div>
            <p className="text-xs text-medium-purple font-medium mb-1">Language</p>
            <p className="text-sm text-deep-purple">{language.charAt(0).toUpperCase() + language.slice(1)}</p>
          </div>
          <div>
            <p className="text-xs text-medium-purple font-medium mb-1">Position</p>
            <p className="text-sm text-deep-purple">{language.charAt(0).toUpperCase() + language.slice(1)} Developer</p>
          </div>
        </div>
      </div>
      
      {/* Analysis sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Impression */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-medium-purple flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/>
                <circle cx="12" cy="10" r="3"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-medium-purple">Overall Impression</h3>
          </div>
          <div className="ml-11">
            <p className="text-sm text-deep-purple whitespace-pre-wrap">{overallImpression || "No overall impression data available."}</p>
          </div>
        </div>
        
        {/* Technical Assessment */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-salmon flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-salmon">Technical Assessment</h3>
          </div>
          <div className="ml-11">
            <p className="text-sm text-deep-purple whitespace-pre-wrap">{technicalAssessment || "No technical assessment data available."}</p>
          </div>
        </div>
      </div>
      
      {/* Strengths and Areas of Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-500">Areas of Strength</h3>
          </div>
          <div className="ml-11">
            <div className="text-sm text-deep-purple whitespace-pre-wrap">{areasOfStrength || "No strengths data available."}</div>
          </div>
        </div>
        
        {/* Areas for Improvement */}
        <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-yellow-500">Areas for Improvement</h3>
          </div>
          <div className="ml-11">
            <div className="text-sm text-deep-purple whitespace-pre-wrap">{areasForImprovement || "No improvement areas data available."}</div>
          </div>
        </div>
      </div>
      
      {/* Follow-up Questions */}
      <div className="p-4 bg-white/80 rounded-lg border border-lavender shadow-sm">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-accent-yellow flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-accent-yellow">Suggested Follow-up Questions</h3>
        </div>
        <div className="ml-11">
          <div className="text-sm text-deep-purple whitespace-pre-wrap">{suggestedQuestions || "No suggested questions available."}</div>
        </div>
      </div>
      
      {/* Final Recommendation */}
      <div className="p-5 bg-gradient-to-br from-soft-blue/10 to-lavender/30 rounded-lg border border-lavender/50 shadow-inner">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-deep-purple flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-deep-purple">Final Recommendation</h3>
        </div>
        <div className="ml-11">
          <p className="text-sm text-deep-purple">{finalRecommendation || "No final recommendation available."}</p>
        </div>
      </div>
      
      {/* Export and Share Options */}
      <div className="flex flex-wrap gap-3 mt-6 justify-end">
        <button className="bg-medium-purple text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-deep-purple transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Report
        </button>
        <button className="bg-lavender/70 text-deep-purple px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-lavender transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share Analysis
        </button>
      </div>
    </div>
  );
};

export default InterviewAnalysisDashboard;