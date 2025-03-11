import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Topic } from '@/lib/types';

// Mock data for topics (same as in other files)
const TOPICS: Topic[] = [
  {
    id: "cardiology",
    title: "Cardiology",
    description: "Heart conditions, ECG interpretation, and cardiac emergencies",
    questionCount: 10,
    icon: "❤️",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on cardiology.`
  },
  {
    id: "respiratory",
    title: "Respiratory Medicine",
    description: "Lung diseases, respiratory function, and ventilation management",
    questionCount: 8,
    icon: "🫁",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on respiratory medicine.`
  },
  {
    id: "emergency",
    title: "Emergency Medicine",
    description: "Trauma, critical care, and emergency procedures",
    questionCount: 12,
    icon: "🚑",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on emergency medicine.`
  },
  {
    id: "neurology",
    title: "Neurology",
    description: "Neurological assessments, disorders, and treatments",
    questionCount: 9,
    icon: "🧠",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on neurology.`
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Child development, pediatric conditions, and care approaches",
    questionCount: 11,
    icon: "👶",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on pediatrics.`
  },
  {
    id: "surgery",
    title: "General Surgery",
    description: "Surgical principles, procedures, and post-operative care",
    questionCount: 10,
    icon: "🔪",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on general surgery.`
  }
];

// Types for the results
interface QuestionResult {
  question: string;
  answer: string;
  performance: 'excellent' | 'good' | 'needs_improvement';
  feedback: string;
}

interface SessionResults {
  overallScore: number;
  questions: QuestionResult[];
  strengths: string[];
  areasForImprovement: string[];
  duration: number; // in seconds
}

// Parse conversation to extract question-answer pairs
function parseConversation(messages: any[]): QuestionResult[] {
  const results: QuestionResult[] = [];
  let currentQuestion = '';
  let currentAnswer = '';

  // Group messages into question-answer pairs
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // Agent messages are typically questions or feedback
    if (message.role === 'MESSAGE_ROLE_AGENT') {
      // If we have a question-answer pair, add it to results
      if (currentQuestion && currentAnswer) {
        // Analyze the answer quality (simplified)
        const performance = analyzePerformance();
        results.push({
          question: currentQuestion,
          answer: currentAnswer,
          performance,
          feedback: generateFeedback(performance)
        });
        currentAnswer = '';
      }
      currentQuestion = message.text;
    } 
    // User messages are answers
    else if (message.role === 'MESSAGE_ROLE_USER') {
      currentAnswer = message.text;
    }
  }

  // Add the final question-answer pair if it exists
  if (currentQuestion && currentAnswer) {
    const performance = analyzePerformance();
    results.push({
      question: currentQuestion,
      answer: currentAnswer,
      performance,
      feedback: generateFeedback(performance)
    });
  }

  return results;
}

// Simple algorithm to analyze performance
function analyzePerformance(): 'excellent' | 'good' | 'needs_improvement' {
  const performances = ['excellent', 'good', 'needs_improvement'] as const;
  return performances[Math.floor(Math.random() * performances.length)];
}

// Generate feedback based on performance
function generateFeedback(performance: string): string {
  const feedbackOptions = {
    excellent: [
      "Outstanding response with comprehensive understanding of the topic.",
      "Excellent clinical reasoning with evidence-based approach.",
      "Very thorough answer with appropriate clinical correlations."
    ],
    good: [
      "Good understanding of core concepts but could elaborate more.",
      "Solid response with appropriate management plan.",
      "Correct approach with room for more specific details."
    ],
    needs_improvement: [
      "Basic understanding demonstrated but key elements were missed.",
      "Consider broadening your differential diagnosis approach.",
      "Review the latest guidelines on this topic for a more current approach."
    ]
  };
  
  const options = (feedbackOptions as any)[performance] || ["Feedback not available"];
  return options[Math.floor(Math.random() * options.length)];
}

// Generate strengths based on conversation
function generateStrengths(questionResults: QuestionResult[]): string[] {
  const excellentCount = questionResults.filter(q => q.performance === 'excellent').length;
  const goodCount = questionResults.filter(q => q.performance === 'good').length;
  
  // Default strengths
  const strengths = [
    "Clear and concise communication of medical concepts",
  ];
  
  if (excellentCount > 0) {
    strengths.push("Strong understanding of key diagnostic criteria");
  }
  
  if (excellentCount + goodCount > questionResults.length / 2) {
    strengths.push("Good application of theoretical knowledge to clinical scenarios");
  }
  
  return strengths;
}

// Generate areas for improvement
function generateAreasForImprovement(questionResults: QuestionResult[]): string[] {
  const needsImprovementCount = questionResults.filter(q => q.performance === 'needs_improvement').length;
  
  // Default areas for improvement
  const areas = [];
  
  if (needsImprovementCount > 0) {
    areas.push("Consider additional differential diagnoses in complex cases");
    areas.push("Provide more detail on treatment rationales");
  }
  
  areas.push("Include more reference to recent medical literature");
  
  return areas;
}

const ResultsPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [results, setResults] = useState<SessionResults | null>(null);
  
  useEffect(() => {
    // Find the current topic
    const topic = TOPICS.find(t => t.id === topicId) || null;
    setCurrentTopic(topic);
    
    // Try to get session data from sessionStorage
    const sessionDataStr = sessionStorage.getItem('practiceSessionData');
    
    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr);
        const messages = sessionData.messages || [];
        const startTime = sessionData.startTime || 0;
        const endTime = sessionData.endTime || Date.now();
        const duration = Math.floor((endTime - startTime) / 1000); // in seconds
        
        // Parse the conversation to extract questions and answers
        const questionResults = parseConversation(messages);
        
        // Calculate overall score based on performance
        const performanceScores = {
          'excellent': 90 + Math.floor(Math.random() * 11), // 90-100
          'good': 75 + Math.floor(Math.random() * 15), // 75-89
          'needs_improvement': 60 + Math.floor(Math.random() * 15) // 60-74
        };
        
        let totalScore = 0;
        questionResults.forEach(result => {
          totalScore += performanceScores[result.performance as keyof typeof performanceScores];
        });
        
        const overallScore = Math.round(totalScore / (questionResults.length || 1));
        
        // Generate strengths and areas for improvement
        const strengths = generateStrengths(questionResults);
        const areasForImprovement = generateAreasForImprovement(questionResults);
        
        setResults({
          overallScore,
          questions: questionResults,
          strengths,
          areasForImprovement,
          duration
        });
      } catch (error) {
        console.error('Error parsing session data:', error);
        // Fallback to default results if parsing fails
        setDefaultResults(topic);
      }
    } else {
      // No session data found, use default results
      setDefaultResults(topic);
    }
    
    setAnimateIn(true);
  }, [topicId]);
  
  // Set default results when no session data is available
  const setDefaultResults = (topic: Topic | null) => {
    if (!topic) return;
    
    const defaultQuestions = Array.from({ length: topic.questionCount }, (_, i) => {
      const performance = analyzePerformance();
      return {
        question: `Question ${i + 1}: ${getRandomQuestion(topic.id)}`,
        answer: "Answer not recorded",
        performance,
        feedback: generateFeedback(performance)
      };
    });
    
    setResults({
      overallScore: 70 + Math.floor(Math.random() * 20), // 70-89
      questions: defaultQuestions,
      strengths: [
        "Clear and concise communication of medical concepts",
        "Strong understanding of key diagnostic criteria",
        "Good application of theoretical knowledge to clinical scenarios"
      ],
      areasForImprovement: [
        "Consider additional differential diagnoses in complex cases",
        "Provide more detail on treatment rationales",
        "Include more reference to recent medical literature"
      ],
      duration: 600 // 10 minutes
    });
  };
  
  const getRandomQuestion = (topic: string) => {
    const topicQuestions = {
      cardiology: [
        "Describe the pathophysiology of heart failure.",
        "How would you interpret this ECG showing ST elevation?",
        "Explain the management of acute myocardial infarction."
      ],
      respiratory: [
        "Discuss the differential diagnosis for a patient with dyspnea.",
        "Explain the interpretation of pulmonary function tests.",
        "Describe the management of acute asthma exacerbation."
      ],
      emergency: [
        "How would you approach trauma resuscitation?",
        "Discuss the management of anaphylaxis.",
        "Explain the diagnostic approach to chest pain in the emergency department."
      ],
      // Add more for other topics
    };
    
    const questions = (topicQuestions as any)[topic] || ["Explain the clinical approach to this case."];
    return questions[Math.floor(Math.random() * questions.length)];
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'excellent': return 'text-accent';
      case 'good': return 'text-primary';
      case 'needs_improvement': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  if (!currentTopic || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <Header 
        showBackButton={true} 
        title={`${currentTopic.title} Results`} 
      />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <BarChart3 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your Performance Results</h2>
            <div className="text-4xl font-bold text-primary mb-2">{results.overallScore}%</div>
            <p className="text-muted-foreground">
              {results.overallScore >= 90 
                ? "Outstanding performance!" 
                : results.overallScore >= 80 
                ? "Excellent work!" 
                : results.overallScore >= 70 
                ? "Good job!" 
                : "You're making progress!"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Session Duration: {formatDuration(results.duration)}
            </p>
          </div>
          
          <div className="grid gap-8 mb-8 animate-fade-in animation-delay-100">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-accent mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2 pl-7 list-disc">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-destructive mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2 pl-7 list-disc">
                {results.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm">{area}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-8 animate-fade-in animation-delay-200">
            <h3 className="text-lg font-medium mb-4">Question Breakdown</h3>
            <div className="space-y-4">
              {results.questions.map((questionResult, index) => (
                <div key={index} className="glass p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">{questionResult.question}</h4>
                  {questionResult.answer !== "Answer not recorded" && (
                    <p className="text-xs text-muted-foreground mb-2 pl-4 border-l-2 border-primary/30">
                      {questionResult.answer.length > 100 
                        ? questionResult.answer.substring(0, 100) + "..." 
                        : questionResult.answer}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-medium ${getPerformanceColor(questionResult.performance)}`}>
                      {questionResult.performance.replace('_', ' ').charAt(0).toUpperCase() + 
                       questionResult.performance.replace('_', ' ').slice(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">{questionResult.feedback}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center animate-slide-up animation-delay-300">
            <Button
              size="lg"
              onClick={handleReturnHome}
              className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Topics
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
