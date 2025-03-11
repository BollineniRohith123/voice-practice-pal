import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import TopicCard, { Topic } from '@/components/TopicCard';
import { Button } from '@/components/ui/button';

// Mock data for topics with system prompts
const TOPICS: Topic[] = [
  {
    id: "cardiology",
    title: "Cardiology",
    description: "Heart conditions, ECG interpretation, and cardiac emergencies",
    questionCount: 10,
    icon: "❤️",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on cardiology. 
    Ask challenging questions about heart conditions, ECG interpretation, and cardiac emergencies one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 10 questions covering various aspects of cardiology.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  },
  {
    id: "respiratory",
    title: "Respiratory Medicine",
    description: "Lung diseases, respiratory function, and ventilation management",
    questionCount: 8,
    icon: "🫁",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on respiratory medicine. 
    Ask challenging questions about lung diseases, respiratory function, and ventilation management one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 8 questions covering various aspects of respiratory medicine.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  },
  {
    id: "emergency",
    title: "Emergency Medicine",
    description: "Trauma, critical care, and emergency procedures",
    questionCount: 12,
    icon: "🚑",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on emergency medicine. 
    Ask challenging questions about trauma, critical care, and emergency procedures one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 12 questions covering various aspects of emergency medicine.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  },
  {
    id: "neurology",
    title: "Neurology",
    description: "Neurological assessments, disorders, and treatments",
    questionCount: 9,
    icon: "🧠",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on neurology. 
    Ask challenging questions about neurological assessments, disorders, and treatments one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 9 questions covering various aspects of neurology.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Child development, pediatric conditions, and care approaches",
    questionCount: 11,
    icon: "👶",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on pediatrics. 
    Ask challenging questions about child development, pediatric conditions, and care approaches one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 11 questions covering various aspects of pediatrics.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  },
  {
    id: "surgery",
    title: "General Surgery",
    description: "Surgical principles, procedures, and post-operative care",
    questionCount: 10,
    icon: "🔪",
    systemPrompt: `You are an experienced medical examiner conducting a viva voce exam for a junior doctor on general surgery. 
    Ask challenging questions about surgical principles, procedures, and post-operative care one by one. 
    After each answer, provide brief feedback before moving to the next question.
    Start by introducing yourself and the topic, then ask your first question.
    Ask a total of 10 questions covering various aspects of general surgery.
    Be professional, insightful, and evaluate responses as an expert examiner would.`
  }
];

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  
  const handleStartPractice = () => {
    if (selectedTopic) {
      navigate(`/practice/${selectedTopic}`);
    }
  };
  
  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <section className="text-center mb-12 animate-slide-down">
          <h2 className="text-4xl sm:text-5xl font-medium mb-4 text-balance">
            Perfect your <span className="text-gradient">Viva Voce</span> skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a medical topic below and practice responding to exam questions verbally, 
            just like in your real Viva Voce assessment.
          </p>
        </section>
        
        <section className="mb-12 animate-slide-up animation-delay-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic) => (
              <div key={topic.id} className="animate-scale-in">
                <TopicCard
                  topic={topic}
                  isSelected={selectedTopic === topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                />
              </div>
            ))}
          </div>
        </section>
        
        <section className="flex justify-center animate-fade-in animation-delay-200">
          <Button
            size="lg"
            onClick={handleStartPractice}
            disabled={!selectedTopic}
            className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Start Practice Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </main>
      
      <footer className="py-6 border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>
            Designed for junior doctors to practice Viva Voce exams with confidence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
