import React, { useState, useCallback } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

interface MicToggleButtonProps {
  role: Role;
}

const MicToggleButton: React.FC<MicToggleButtonProps> = ({ role }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      setIsAnimating(true);
      setIsMuted(!isMuted);
      
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 700);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [isMuted, role]);

  const isUser = role === Role.USER;
  const label = isUser ? 'Microphone' : 'Speaker';

  return (
    <button
      onClick={toggleMic}
      className={`
        relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
        transition-all duration-300
        ${isMuted 
          ? 'bg-gradient-to-r from-salmon to-red-400 hover:opacity-90 text-white' 
          : 'bg-gradient-to-r from-lavender to-soft-blue/20 hover:bg-opacity-80 text-deep-purple'}
        border border-transparent hover:border-medium-purple
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medium-purple
        overflow-hidden group
      `}
      aria-label={`${isMuted ? 'Unmute' : 'Mute'} ${label}`}
      title={`${isMuted ? 'Unmute' : 'Mute'} ${label}`}
    >
      {/* Ripple effect animation */}
      {isAnimating && (
        <span className="absolute inset-0 w-full h-full">
          <span className="animate-[ripple_0.7s_ease-out] absolute inset-0 rounded-lg opacity-70 bg-white"></span>
        </span>
      )}
      
      {/* Subtle hover effect */}
      <span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors"></span>
      
      {/* Icon and label */}
      <div className="flex items-center justify-center gap-2 relative">
        <div className={`flex items-center justify-center rounded-full w-8 h-8 
          ${isMuted ? 'bg-white/20' : 'bg-deep-purple/10'} 
          transition-transform group-hover:scale-110 duration-300`}
        >
          {isMuted ? (
            isUser ? (
              <MicOffIcon className="w-5 h-5" />
            ) : (
              <VolumeOffIcon className="w-5 h-5" />
            )
          ) : (
            <>
              {isUser ? (
                <MicIcon className="w-5 h-5" />
              ) : (
                <Volume2Icon className="w-5 h-5" />
              )}
              
              {/* Sound wave animation for active state */}
              {!isMuted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="sound-wave"></div>
                </div>
              )}
            </>
          )}
        </div>
        
        <span className="text-sm font-medium group-hover:font-semibold transition-all">
          {isMuted ? `Unmute ${label}` : `Mute ${label}`}
        </span>
      </div>
    </button>
  );
};

export default MicToggleButton;