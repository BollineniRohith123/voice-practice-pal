
import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceIndicatorProps {
  status: 'idle' | 'speaking' | 'listening';
}

const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={cn(
          "absolute inset-0 rounded-full", 
          status !== 'idle' && "animate-pulse-ring",
          status === 'speaking' ? "bg-primary/20" : status === 'listening' ? "bg-accent/20" : "bg-transparent"
        )} />
        <div className={cn(
          "relative flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300",
          status === 'idle' ? "bg-secondary" : status === 'speaking' ? "bg-primary" : "bg-accent"
        )}>
          <Mic className={cn(
            "w-8 h-8 transition-colors duration-300",
            status === 'idle' ? "text-muted-foreground" : "text-white"
          )} />
        </div>
      </div>
      
      {status !== 'idle' && (
        <div className="voice-wave-container mt-4">
          <div className={`voice-wave-bar animate-wave1 ${status === 'speaking' ? "bg-primary" : "bg-accent"}`}></div>
          <div className={`voice-wave-bar animate-wave2 ${status === 'speaking' ? "bg-primary" : "bg-accent"}`}></div>
          <div className={`voice-wave-bar animate-wave3 ${status === 'speaking' ? "bg-primary" : "bg-accent"}`}></div>
          <div className={`voice-wave-bar animate-wave4 ${status === 'speaking' ? "bg-primary" : "bg-accent"}`}></div>
          <div className={`voice-wave-bar animate-wave5 ${status === 'speaking' ? "bg-primary" : "bg-accent"}`}></div>
        </div>
      )}
      
      <p className="mt-3 text-sm font-medium">
        {status === 'idle' ? 'Ready' : status === 'speaking' ? 'Speaking...' : 'Listening...'}
      </p>
    </div>
  );
};

export default VoiceIndicator;
