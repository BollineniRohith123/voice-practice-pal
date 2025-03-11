
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false,
  title = "Viva Voce Practice"
}) => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full py-6 px-4 sm:px-6 glass fixed top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-xl font-medium text-balance">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-foreground/70">
            Beta
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
