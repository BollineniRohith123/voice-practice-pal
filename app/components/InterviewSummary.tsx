'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AssessmentData {
  technicalKnowledge: number;
  clinicalReasoning: number;
  diagnosticApproach: number;
  managementPlanning: number;
  studentName: string;
  medicalSchool: string;
  yearOfStudy: string;
  category: string;
  question: string;
  answer: string;
}

interface InterviewSummaryProps {
  assessmentData: AssessmentData;
  sessionId: string;
}

const InterviewSummary: React.FC<InterviewSummaryProps> = ({ assessmentData, sessionId }) => {
  const {
    technicalKnowledge,
    clinicalReasoning,
    diagnosticApproach,
    managementPlanning,
    studentName,
    medicalSchool,
    yearOfStudy,
    category
  } = assessmentData;

  const totalScore = (
    (technicalKnowledge / 25 * 100 +
    clinicalReasoning / 30 * 100 +
    diagnosticApproach / 25 * 100 +
    managementPlanning / 20 * 100) / 4
  ).toFixed(1);

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendation = () => {
    const score = parseFloat(totalScore);
    if (score >= 80) return { text: 'Pass with Distinction', color: 'text-emerald-700 bg-emerald-50' };
    if (score >= 70) return { text: 'Pass', color: 'text-blue-700 bg-blue-50' };
    if (score >= 60) return { text: 'Borderline Pass', color: 'text-yellow-700 bg-yellow-50' };
    return { text: 'Needs Improvement', color: 'text-red-700 bg-red-50' };
  };

  const recommendation = getRecommendation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Summary</h1>
          <p className="text-gray-600 mt-1">Session ID: {sessionId}</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${recommendation.color}`}>
          {recommendation.text}
        </div>
      </div>

      {/* Student Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{studentName}</p>
          </div>
          <div>
            <p className="text-gray-600">Medical School</p>
            <p className="font-medium">{medicalSchool}</p>
          </div>
          <div>
            <p className="text-gray-600">Year of Study</p>
            <p className="font-medium">{yearOfStudy}</p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <p className="font-medium">{category}</p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Overall Performance</h2>
          <div className="text-3xl font-bold text-deep-purple">{totalScore}%</div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Technical Knowledge</span>
              <span className="font-medium">{(technicalKnowledge / 25 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(technicalKnowledge / 25) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${getScoreColor(technicalKnowledge, 25)}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clinical Reasoning</span>
              <span className="font-medium">{(clinicalReasoning / 30 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(clinicalReasoning / 30) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${getScoreColor(clinicalReasoning, 30)}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Diagnostic Approach</span>
              <span className="font-medium">{(diagnosticApproach / 25 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(diagnosticApproach / 25) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${getScoreColor(diagnosticApproach, 25)}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Management Planning</span>
              <span className="font-medium">{(managementPlanning / 20 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(managementPlanning / 20) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${getScoreColor(managementPlanning, 20)}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Download Report
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 text-white bg-deep-purple rounded-md hover:bg-medium-purple transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </motion.div>
  );
};

export default InterviewSummary;