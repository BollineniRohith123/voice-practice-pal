export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
}

export interface Question {
  id: string;
  text: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ClinicalScenario {
  id: string;
  title: string;
  description: string;
  topic: string;
  complexity: 'low' | 'medium' | 'high';
}

export const MEDICAL_TOPICS: Topic[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: '❤️',
    description: 'Heart conditions, ECG interpretation, and cardiac emergencies',
    questionCount: 10
  },
  {
    id: 'respiratory-medicine',
    name: 'Respiratory Medicine',
    icon: '🫁',
    description: 'Lung diseases, respiratory function, and ventilation management',
    questionCount: 8
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    icon: '🚑',
    description: 'Trauma, critical care, and emergency procedures',
    questionCount: 12
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: '🧠',
    description: 'Neurological assessments, disorders, and treatments',
    questionCount: 9
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: '👶',
    description: 'Child development, pediatric conditions, and care approaches',
    questionCount: 11
  },
  {
    id: 'general-surgery',
    name: 'General Surgery',
    icon: '🔬',
    description: 'Surgical principles, procedures, and post-operative care',
    questionCount: 10
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'card-1',
    text: 'Describe the pathophysiology of acute myocardial infarction.',
    topic: 'cardiology',
    difficulty: 'medium'
  },
  {
    id: 'resp-1',
    text: 'What are the diagnostic criteria for COPD?',
    topic: 'respiratory-medicine',
    difficulty: 'easy'
  },
  {
    id: 'neuro-1',
    text: 'Explain the different types of stroke and their management.',
    topic: 'neurology',
    difficulty: 'hard'
  }
];

export const CLINICAL_SCENARIOS: ClinicalScenario[] = [
  {
    id: 'card-scenario-1',
    title: 'Acute Chest Pain',
    description: 'A 55-year-old male presents with sudden onset chest pain radiating to the left arm.',
    topic: 'cardiology',
    complexity: 'medium'
  },
  {
    id: 'resp-scenario-1',
    title: 'Respiratory Distress',
    description: 'A 45-year-old female presents with progressive shortness of breath and wheezing.',
    topic: 'respiratory-medicine',
    complexity: 'medium'
  },
  {
    id: 'emerg-scenario-1',
    title: 'Multiple Trauma',
    description: 'A 30-year-old motorcyclist brought to ED after a high-speed collision.',
    topic: 'emergency-medicine',
    complexity: 'high'
  }
];
