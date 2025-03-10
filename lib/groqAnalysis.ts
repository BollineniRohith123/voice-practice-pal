'use client';

import Groq from 'groq-sdk';

// Define interview message type to match the API response
export interface InterviewMessage {
  role: string;
  text: string;
  medium: string;
  callStageMessageIndex: number;
  callStageId: string;
}

export interface InterviewData {
  results: InterviewMessage[];
  total: number;
  next: string | null;
  previous: string | null;
}

// Rating types for the interview analysis
export interface InterviewRatings {
  technicalScore: number;
  communicationScore: number;
  problemSolving: number;
  overallScore: number;
  recommendation: 'Hire' | 'Consider' | 'Do Not Recommend';
}

// Store the interview data temporarily
let storedInterviewData: InterviewData | null = null;
let storedInterviewRatings: InterviewRatings | null = null;

// Function to store interview data
export function storeInterviewData(data: InterviewData) {
  storedInterviewData = data;
  return storedInterviewData;
}

// Function to get stored interview data
export function getStoredInterviewData(): InterviewData | null {
  return storedInterviewData;
}

// Function to store interview ratings
export function storeInterviewRatings(ratings: InterviewRatings) {
  storedInterviewRatings = ratings;
  return storedInterviewRatings;
}

// Function to get stored interview ratings
export function getStoredInterviewRatings(): InterviewRatings | null {
  return storedInterviewRatings;
}

// Parse the interview analysis to extract ratings
export function extractRatingsFromAnalysis(analysis: string): InterviewRatings {
  // Default values
  const defaultRatings: InterviewRatings = {
    technicalScore: 60,
    communicationScore: 60,
    problemSolving: 60,
    overallScore: 60,
    recommendation: 'Consider'
  };
  
  try {
    // Try to extract numbers from the analysis text
    const technicalScoreMatch = analysis.match(/technical[^0-9]*(\d+)/i);
    const communicationScoreMatch = analysis.match(/communication[^0-9]*(\d+)/i);
    const problemSolvingMatch = analysis.match(/problem[^0-9]*solving[^0-9]*(\d+)/i);
    const overallScoreMatch = analysis.match(/overall[^0-9]*(\d+)/i);
    
    // Extract recommendation
    let recommendation: InterviewRatings['recommendation'] = 'Consider';
    if (analysis.toLowerCase().includes('hire') && !analysis.toLowerCase().includes('do not hire')) {
      recommendation = 'Hire';
    } else if (analysis.toLowerCase().includes('not recommend') || analysis.toLowerCase().includes('do not hire')) {
      recommendation = 'Do Not Recommend';
    }
    
    return {
      technicalScore: technicalScoreMatch ? Math.min(100, Math.max(0, parseInt(technicalScoreMatch[1]))) : defaultRatings.technicalScore,
      communicationScore: communicationScoreMatch ? Math.min(100, Math.max(0, parseInt(communicationScoreMatch[1]))) : defaultRatings.communicationScore,
      problemSolving: problemSolvingMatch ? Math.min(100, Math.max(0, parseInt(problemSolvingMatch[1]))) : defaultRatings.problemSolving,
      overallScore: overallScoreMatch ? Math.min(100, Math.max(0, parseInt(overallScoreMatch[1]))) : defaultRatings.overallScore,
      recommendation: recommendation
    };
  } catch (error) {
    console.error('Error extracting ratings:', error);
    return defaultRatings;
  }
}

// Function to analyze the interview with Groq
export async function analyzeInterview(data: InterviewData, language: string): Promise<string> {
  try {
    // Create a new Groq client with dangerouslyAllowBrowser flag set to true
    const groq = new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      dangerouslyAllowBrowser: true // Add this flag to allow browser usage
    });

    // Format the conversation for the LLM, ensuring all messages have the required content property
    const validMessages = data.results
      .filter(msg => msg.text && msg.text.trim() !== ''); // Filter out empty messages
      
    const formattedMessages = validMessages.map(msg => {
      // Map Ultravox roles to OpenAI roles
      let role: 'user' | 'assistant' | 'system';
      
      if (msg.role === 'MESSAGE_ROLE_USER') {
        role = 'user';
      } else if (msg.role === 'MESSAGE_ROLE_AGENT') {
        role = 'assistant';
      } else {
        role = 'system';
      }
      
      return {
        role,
        content: msg.text
      };
    });

    // Add a system prompt to guide the analysis with specific rating instructions
    const systemPrompt = {
      role: "system",
      content: `You are an expert interview evaluator specializing in technical ${language} interviews. 
      Analyze the following interview transcript and provide a detailed assessment including:
      
      1. Overall impression of the candidate's performance
      2. Technical knowledge assessment (provide a score from 0-100)
      3. Communication skills evaluation (provide a score from 0-100)
      4. Problem-solving ability (provide a score from 0-100)
      5. Areas of strength (bullet points)
      6. Areas for improvement (bullet points)
      7. Suggested follow-up questions for a future interview
      8. Final recommendation (Hire, Consider, or Do Not Recommend)
      9. Overall score (0-100)
      
      Format your response with clear sections and bullet points where appropriate.
      IMPORTANT: Make sure to include numerical scores (0-100) for technical knowledge, communication skills, problem-solving ability, and overall performance.`
    };

    // Create the message array with system prompt followed by the conversation
    const messages = [systemPrompt, ...formattedMessages];

    console.log('Sending messages to Groq:', JSON.stringify(messages));
    
    // Call the Groq API
    const result = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048, // Increase token limit for more detailed analysis
      top_p: 1,
      stream: false
    });

    const analysisText = result.choices[0]?.message?.content || 'No analysis was generated';
    
    // Extract and store ratings
    const ratings = extractRatingsFromAnalysis(analysisText);
    storeInterviewRatings(ratings);
    
    return analysisText;
  } catch (error) {
    console.error('Error analyzing interview with Groq:', error);
    return 'Failed to analyze interview. Please check your API configuration.';
  }
}