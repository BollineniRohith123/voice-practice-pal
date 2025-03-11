
import React from 'react';
import { cn } from '@/lib/utils';

export interface Topic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  icon: string;
}

interface TopicCardProps {
  topic: Topic;
  isSelected: boolean;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "w-full p-6 rounded-2xl glass card-hover cursor-pointer transition-all duration-300",
        isSelected ? "ring-2 ring-primary shadow-md" : "hover:bg-white/90"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-2xl">{topic.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-1">{topic.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {topic.questionCount} questions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
