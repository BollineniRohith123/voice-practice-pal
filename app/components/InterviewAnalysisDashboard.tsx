'use client';
import React from 'react';
import { InterviewRatings } from '@/lib/groqAnalysis';

interface VivaVoceAnalysisDashboardProps {
  analysis: string;
  ratings: InterviewRatings;
  candidateName?: string;
  language: string; // Now represents medical specialty
}

const VivaVoceAnalysisDashboard: React.FC<VivaVoceAnalysisDashboardProps> = ({ 
  analysis, 
  ratings, 
  candidateName = "Student", 
  language 
}) => {
  // Helper function to determine background color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (score >= 65) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  // Helper function to determine recommendation badge color
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Pass with Distinction': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pass': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Borderline Pass': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fail': return 'bg-red-100 text-red-800 border-red-200';
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
  const clinicalKnowledgeAssessment = getSection('Clinical knowledge assessment');
  const communicationSkills = getSection('Communication skills evaluation');
  const areasOfStrength = getSection('Areas of strength');
  const areasForImprovement = getSection('Areas for improvement');
  const suggestedReadings = getSection('Suggested readings');
  const finalRecommendation = getSection('Final recommendation');

  return (
    <div className="space-y-6 sm:space-y-8 animate-[fadeIn_0.6s_ease-in] p-4">
      {/* Header with student name and final recommendation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gradient-purple">
          Viva Voce Assessment: {candidateName}
        </h2>
        <div className={`px-4 py-1.5 rounded-full border-2 ${getRecommendationColor(ratings.recommendation)} text-sm font-medium shadow-sm`}>
          {ratings.recommendation}
        </div>
      </div>
      
      {/* Overall score in a large circular display */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-current text-lavender/30"
              strokeWidth="3.8"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-current text-medium-purple"
              strokeWidth="3.8"
              strokeDasharray={`${ratings.overallScore}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl sm:text-5xl font-bold text-deep-purple">
              {ratings.overallScore}%
            </span>
            <span className="text-sm text-medium-purple mt-1">Overall Score</span>
          </div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-deep-purple to-medium-purple text-white text-xs px-4 py-1.5 rounded-full shadow-md">
            Overall Performance
          </div>
        </div>
      </div>
      
      {/* Detailed score bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Clinical Knowledge Score */}
        <div className="p-4 sm:p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-deep-purple">Clinical Knowledge</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.technicalScore}%</span>
          </div>
          <div className="relative w-full">
            <div className="w-full bg-lavender/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getScoreColor(ratings.technicalScore)} shadow-sm transition-all duration-1000 ease-out`} 
                style={{ width: `${ratings.technicalScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Communication Score */}
        <div className="p-4 sm:p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-deep-purple">Communication</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.communicationScore}%</span>
          </div>
          <div className="relative w-full">
            <div className="w-full bg-lavender/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getScoreColor(ratings.communicationScore)} shadow-sm transition-all duration-1000 ease-out`} 
                style={{ width: `${ratings.communicationScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Clinical Reasoning Score */}
        <div className="p-4 sm:p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-deep-purple">Clinical Reasoning</h3>
            <span className="text-sm font-bold text-deep-purple">{ratings.problemSolving}%</span>
          </div>
          <div className="relative w-full">
            <div className="w-full bg-lavender/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getScoreColor(ratings.problemSolving)} shadow-sm transition-all duration-1000 ease-out`} 
                style={{ width: `${ratings.problemSolving}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medical specialty and assessment details */}
      <div className="p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple flex items-center justify-center mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gradient-purple">Assessment Details</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-14">
          <div>
            <p className="text-sm text-medium-purple font-medium mb-2">Specialty</p>
            <p className="text-base text-deep-purple">
              {language === 'cardiology' ? 'Cardiology' : 
               language === 'neurology' ? 'Neurology' : 
               language === 'pediatrics' ? 'Pediatrics' : 
               language === 'emergency-medicine' ? 'Emergency Medicine' : 
               language.charAt(0).toUpperCase() + language.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-medium-purple font-medium mb-2">Level</p>
            <p className="text-base text-deep-purple">Medical Viva Voce</p>
          </div>
        </div>
      </div>
      
      {/* Analysis sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Overall Impression */}
        <div className="p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-medium-purple to-soft-blue flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/>
                <circle cx="12" cy="10" r="3"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gradient-purple">Overall Impression</h3>
          </div>
          <div className="ml-14">
            <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{overallImpression || "No overall impression data available."}</p>
          </div>
        </div>
        
        {/* Communication Skills */}
        <div className="p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-soft-blue to-medium-purple flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gradient-purple">Communication Skills</h3>
          </div>
          <div className="ml-14">
            <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{communicationSkills || "No communication skills data available."}</p>
          </div>
        </div>
        
        {/* Areas of Strength and Improvement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-6 bg-white/80 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-700">Strengths</h3>
            </div>
            <div className="ml-14">
              <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{areasOfStrength || "No strengths data available."}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white/80 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-yellow-700">To Improve</h3>
            </div>
            <div className="ml-14">
              <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{areasForImprovement || "No improvement areas data available."}</p>
            </div>
          </div>
        </div>
        
        {/* Suggested Readings */}
        <div className="p-6 bg-white/80 rounded-xl border-2 border-lavender shadow-sm hover:shadow-md transition-all duration-300 glass-effect">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-yellow to-salmon flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gradient-purple">Suggested Readings</h3>
          </div>
          <div className="ml-14">
            <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{suggestedReadings || "No suggested readings available."}</p>
          </div>
        </div>
        
        {/* Final Recommendation */}
        <div className="p-6 bg-gradient-to-br from-deep-purple/5 to-medium-purple/5 rounded-xl border-2 border-medium-purple shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gradient-purple">Final Recommendation</h3>
          </div>
          <div className="ml-14">
            <p className="text-base text-deep-purple whitespace-pre-wrap leading-relaxed">{finalRecommendation || "No final recommendation available."}</p>
          </div>
        </div>
      </div>
      
      {/* Export and Certificate Options */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center sm:justify-end">
        <button className="bg-gradient-to-r from-deep-purple to-medium-purple text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Assessment
        </button>
        <button className="bg-white border-2 border-lavender text-deep-purple px-6 py-3 rounded-xl text-sm font-medium flex items-center hover:bg-lavender/10 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Schedule Next Assessment
        </button>
      </div>
    </div>
  );
};

export default VivaVoceAnalysisDashboard;
