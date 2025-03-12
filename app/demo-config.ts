import { DemoConfig, ParameterLocation, SelectedTool, RoleEnum } from "@/lib/types";
import { formatISO } from 'date-fns';
import { logger } from "../lib/logger";

// Medical viva voce categories by specialty
export const MEDICAL_VIVA_CATEGORIES = {
  cardiology: [
    "Cardiovascular_Pathophysiology",
    "ECG_Interpretation",
    "Pharmacology",
    "Clinical_Management",
    "Recent_Advances"
  ],
  neurology: [
    "Neuroanatomy",
    "Neurological_Examination",
    "Movement_Disorders",
    "Cerebrovascular_Disease",
    "Neuropharmacology"
  ],
  pediatrics: [
    "Growth_and_Development",
    "Pediatric_Emergencies",
    "Congenital_Disorders",
    "Infectious_Disease",
    "Neonatology"
  ],
  "emergency-medicine": [
    "Trauma_Management",
    "Resuscitation",
    "Toxicology",
    "Environmental_Emergencies",
    "Critical_Care"
  ]
};

// Clinical scenarios by specialty
export const CLINICAL_SCENARIOS = {
  cardiology: {
    patient: "Rajashekar, 58-year-old male",
    presentation: "Breathlessness (3 months) and leg edema",
    history: "Diabetes and hypertension (10 years)",
    examination: "Visible neck pulsations and irregular pulse",
    context: "Patient appears fatigued with labored breathing and speaks Kannada"
  },
  neurology: {
    patient: "Priya, 42-year-old female",
    presentation: "Progressive weakness in right arm and leg (6 months)",
    history: "Migraines (15 years), recent vision changes",
    examination: "Asymmetric reflexes, decreased sensation in right extremities",
    context: "Works as a software engineer, concerned about ability to type"
  },
  pediatrics: {
    patient: "Arjun, 4-year-old male",
    presentation: "Recurrent fever and rash for 2 weeks",
    history: "Previously healthy, fully vaccinated",
    examination: "Strawberry tongue, desquamation of fingertips, cervical lymphadenopathy",
    context: "Parents report irritability and joint pain when moving"
  },
  "emergency-medicine": {
    patient: "Maya, 26-year-old female",
    presentation: "Sudden onset severe headache and vomiting",
    history: "No significant past medical history, on oral contraceptives",
    examination: "Photophobia, neck stiffness, Glasgow Coma Scale 14/15",
    context: "Symptoms began during exercise at the gym"
  }
};

// Voice configuration - extracted for flexibility
export const VOICE_CONFIG = {
  DEFAULT_VOICE_ID: "a0998448-6810-4b44-bc90-ccb69d2a26f5",
  TEMPERATURE: 0.7,
  LANGUAGE_HINT: "en"
};

/**
 * Generate system prompt with proper medical specialty parameter substitution
 * @param specialty - The medical specialty for the viva voce assessment
 * @returns Formatted system prompt
 */
function getSystemPrompt(specialty: string = "cardiology"): string {
  const normalizedSpecialty = specialty.toLowerCase() as keyof typeof MEDICAL_VIVA_CATEGORIES;
  if (!MEDICAL_VIVA_CATEGORIES[normalizedSpecialty]) {
    logger.warn(`Unsupported specialty: ${specialty}, defaulting to Cardiology`);
    specialty = "cardiology";
  }
  
  const formattedDate = formatISO(new Date());
  const scenarioData = CLINICAL_SCENARIOS[normalizedSpecialty as keyof typeof CLINICAL_SCENARIOS];
  
  let sysPrompt: string = `
  # CORE PERSONA: DR. PRIYA
  You are Dr. Priya, a distinguished medical examiner known for your precise, engaging teaching style. Your voice carries warmth and authority, making students feel supported while maintaining high academic standards.

  # INITIAL INTERACTION
  1. GREETING
     - Begin with: "Hello, I'm Dr. Priya, and I'll be conducting your ${specialty} viva voce examination today."
     - Ask: "Could you please introduce yourself?"
     - After student's introduction, say: "Thank you. Let's begin with a clinical case."

  2. CASE PRESENTATION
     - Present the scenario clearly and concisely
     - Allow a moment for the student to process
     - Start with broader questions, then narrow focus

  # EXAMINATION PRINCIPLES
  1. STRUCTURED PROGRESSION
     - Begin with patient presentation
     - Develop through history and examination
     - Build to investigations and management
     - End with complications and special considerations

  2. CONVERSATION STYLE
     - Use clear, precise medical terminology
     - Maintain professional warmth
     - Give subtle encouragement through tone
     - Use strategic silences for thinking time
     - Guide without leading

  3. RESPONSE HANDLING
     - For correct answers: "That's correct. Let's explore further..."
     - For partial answers: "Good start. Consider also..."
     - For incorrect answers: "Let's think about this differently..."
     - After silence: "Take your time. Would you like me to rephrase the question?"
     - For excellent answers: "Excellent clinical reasoning. Now let's consider..."

  4. QUESTION TIMING
     - Wait 5 seconds for initial response
     - At 10 seconds: Offer gentle prompt
     - At 15 seconds: Rephrase question
     - At 20 seconds: Move to simpler aspect

  4. CLINICAL REASONING FOCUS
     - Start with "What do you notice first about this patient?"
     - Build each question from the previous answer
     - Connect symptoms to underlying pathophysiology
     - Challenge students to justify their clinical decisions
     - Guide them through complex decision-making

  # QUESTIONING TECHNIQUES
  1. DIRECT QUESTIONS
     - "What's the most likely diagnosis given these symptoms?"
     - "Which examination findings support your hypothesis?"
     - "What investigations would you order first, and why?"
     - "How would you manage this patient immediately?"

  2. FOLLOW-UP QUESTIONS
     - "How would that affect your management plan?"
     - "What complications should we anticipate?"
     - "Why did you prioritize that investigation?"
     - "What's the key pathophysiology driving these symptoms?"

  3. CHALLENGE QUESTIONS
     - "What if the patient develops [new symptom]?"
     - "How would your approach change if [parameter] was different?"
     - "What's the evidence supporting this treatment choice?"
     - "What are the risks of your proposed intervention?"

  # CLINICAL SCENARIO HANDLING
  ${scenarioData.patient} presents with ${scenarioData.presentation}. History of ${scenarioData.history}. Examination reveals ${scenarioData.examination}. ${scenarioData.context}.

  # STRUCTURED PROGRESSION
  1. Opening (1 minute)
     - "Let's begin our ${specialty} viva voce examination."
     - Immediately present the clinical scenario
     - "What's your initial assessment of this patient?"

  2. Core Assessment (25 minutes)
     - Systematically cover:
       * Initial clinical impression
       * Focused examination findings
       * Key investigations
       * Management priorities
       * Potential complications
     - Build complexity progressively
     - Keep pushing deeper into reasoning

  3. Clinical Reasoning (15 minutes)
     - Present complications or changes in patient status
     - Challenge initial assumptions
     - Test adaptation to new information
     - Explore evidence-based decision making

  4. Wrap-up (4 minutes)
     - Test key learning points
     - Brief, specific feedback
     - End with a challenging thought question

  # EXAMINATION STANDARDS
  - Technical Knowledge (25%): Procedures, anatomy, examination techniques
  - Clinical Reasoning (30%): Diagnostic thinking, pattern recognition
  - Diagnostic Approach (25%): Investigation choice, result interpretation
  - Management Planning (20%): Treatment decisions, risk assessment

  # SCORING GUIDELINES
  Silently evaluate:
  - Technical Knowledge: /25 (examination technique, anatomical knowledge)
  - Clinical Reasoning: /30 (diagnostic thinking, pattern recognition)
  - Diagnostic Approach: /25 (test selection, result interpretation)
  - Management Planning: /20 (treatment choices, risk assessment)

  # KEY RULES
  1. NEVER mention scoring or assessment during the examination
  2. Keep responses under 20 seconds
  3. Always end with a clear question
  4. Focus on clinical reasoning over fact recall
  5. Adapt difficulty based on student performance

  # CLINICAL SCENARIO FORMAT
  Begin case presentation with:
  "Let me present our case for today. ${scenarioData.patient} has presented with ${scenarioData.presentation}. [Brief pause] From this initial information, what are your first thoughts?"

  # CRITICAL ELEMENTS
  1. Never break character as Dr. Priya
  2. Keep responses focused and clinical
  3. Always maintain educational value
  4. Guide without giving answers
  5. Adapt difficulty based on responses

  # SESSION FLOW
  1. Opening Phase (5 minutes)
     - Introduction and rapport building
     - Initial case presentation
     - Broad differential thinking

  2. Core Phase (20 minutes)
     - Systematic examination approach
     - Key investigations discussion
     - Management planning

  3. Challenge Phase (10 minutes)
     - Complications
     - Special considerations
     - Evidence-based discussion

  4. Conclusion (5 minutes)
     - Summary of key points
     - Final challenging question
     - Professional closure

  Remember: Maintain professionalism while being supportive and challenging. Guide the student through clinical reasoning without providing direct answers.
  Current time: ${formattedDate}
  `;
  
  return sysPrompt.replace(/"/g, '\"').replace(/\n/g, '\n');
}

/**
 * Create data capture tool for the viva voce assessment process
 * @returns Array of selected tools
 */
function createVivaVoceTools(): SelectedTool[] {
  return [
    {
      "temporaryTool": {
        "modelToolName": "captureVivaVoceData",
        "description": "Capture viva voce assessment data for final report generation. Use this to track questions, answers, and evaluations.",
        "dynamicParameters": [
          {
            "name": "assessmentData",
            "location": ParameterLocation.BODY,
            "schema": {
              "type": "object",
              "properties": {
                "type": { 
                  "type": "string",
                  "enum": ["student_info", "question_answer", "category_complete", "assessment_complete"],
                  "description": "The type of data being captured" 
                },
                "data": { 
                  "type": "object",
                  "description": "The data to capture",
                  "properties": {
                    "question": { "type": "string" },
                    "answer": { "type": "string" },
                    "category": { "type": "string" },
                    "technicalKnowledge": { "type": "number", "minimum": 0, "maximum": 25 },
                    "clinicalReasoning": { "type": "number", "minimum": 0, "maximum": 30 },
                    "diagnosticApproach": { "type": "number", "minimum": 0, "maximum": 25 },
                    "managementPlanning": { "type": "number", "minimum": 0, "maximum": 20 },
                    "studentName": { "type": "string" },
                    "medicalSchool": { "type": "string" },
                    "yearOfStudy": { "type": "string" },
                    "priorExperience": { "type": "string" }
                  }
                },
                "timestamp": {
                  "type": "string",
                  "description": "ISO timestamp of when data was captured"
                },
                "sessionId": {
                  "type": "string",
                  "description": "Unique session identifier for the assessment"
                }
              },
              "required": ["type", "data", "timestamp", "sessionId"]
            },
            "required": true
          }
        ],
        "client": {
          "onError": (error: any) => {
            logger.error("Tool execution error:", error);
            // Handle assessment data capture failures gracefully
            return {
              success: false,
              error: "Failed to capture assessment data",
              details: error?.message || "Unknown error"
            };
          }
        }
      }
    }
  ];
}

/**
 * Create a demo configuration with proper error handling
 * @param specialty - Medical specialty for the viva voce
 * @returns Complete demo configuration
 */
export function createDemoConfig(specialty: string = "cardiology"): DemoConfig {
  try {
    // Case-insensitive specialty validation
    const normalizedSpecialty = specialty.toLowerCase();
    const supportedSpecialties = Object.keys(MEDICAL_VIVA_CATEGORIES);
    
    // Check if the lowercase specialty is in our supported specialties
    const isSupported = supportedSpecialties.includes(normalizedSpecialty);
    const validSpecialty = isSupported ? normalizedSpecialty : "cardiology";
      
    if (!isSupported) {
      logger.warn(`Invalid specialty requested: ${specialty}. Defaulting to Cardiology.`);
    }
    
    // Generate session ID for tracking
    const sessionId = `medviva-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Format specialty name for display
    const formattedSpecialty = validSpecialty.charAt(0).toUpperCase() + validSpecialty.slice(1);
    
    // Create demo configuration
    return {
      title: "Medical Viva Voce Assessment",
      overview: `AI-powered ${formattedSpecialty} viva voce assessment with Dr. Priya`,
      sessionId,
      callConfig: {
        systemPrompt: getSystemPrompt(validSpecialty),
        model: "fixie-ai/ultravox-70B",
        languageHint: VOICE_CONFIG.LANGUAGE_HINT,
        selectedTools: createVivaVoceTools(),
        voice: VOICE_CONFIG.DEFAULT_VOICE_ID,
        temperature: VOICE_CONFIG.TEMPERATURE,
        initialMessages: [
          {
            role: RoleEnum.ASSISTANT,
            text: `Hello, I'm Dr. Priya, and I'll be conducting your ${formattedSpecialty} viva voce examination today. Could you please introduce yourself?`
          }
        ],
        experimentalSettings: {
          allowedResponseDuration: "30s",
          maxResponseDuration: "120s"
        },
        interactionConfig: {
          allowInterruptions: true,
          minSilenceThreshold: 3000, // 3 seconds of silence before prompting
          maxSilenceThreshold: 10000 // 10 seconds max silence before moving on
        }
      }
    };
  } catch (error) {
    logger.error("Error creating demo config:", error);
    throw new Error("Failed to create viva voce configuration");
  }
}

// Default export for backward compatibility
const demoConfig = createDemoConfig();
export { demoConfig }; // Add named export for demoConfig
export default demoConfig;
