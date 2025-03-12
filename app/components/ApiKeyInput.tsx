'use client';

import React, { useState, useEffect } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string, isValid: boolean) => void;
  defaultApiKey?: string;
}

interface AccountInfo {
  freeTimeRemaining: string;
  hasActiveSubscription: boolean;
}

export default function ApiKeyInput({ onApiKeyChange, defaultApiKey }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState<string>(defaultApiKey || '');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    localStorage.removeItem('security_key');
    setApiKey('');
    setIsValid(false);
  }, []);

  const validateApiKey = async (key: string) => {
    try {
      setIsValidating(true);
      setValidationError('');

      const response = await fetch('/api/ultravox/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid security key');
      }

      setIsValid(true);
      setAccountInfo(data.accountInfo);
      localStorage.setItem('security_key', key);
      onApiKeyChange(key, true);
    } catch (error) {
      setIsValid(false);
      setValidationError(error instanceof Error ? error.message : 'Validation failed');
      onApiKeyChange('', false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      validateApiKey(apiKey);
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    setIsValid(false);
    setValidationError('');
    setShowApiKey(false);
    setAccountInfo(null);
    localStorage.removeItem('security_key');
    onApiKeyChange('', false);
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 glass-effect rounded-xl p-4 sm:p-6 border border-lavender">
        <label htmlFor="security-key" className="text-sm font-medium text-deep-purple flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span>Security Key</span>
        </label>
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type={showApiKey ? "text" : "password"}
              id="security-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your security key"
              className={`w-full pl-10 pr-[140px] py-3.5 rounded-xl border-2 text-gray-900 
                placeholder:text-gray-400 transition-all duration-300
                ${isValid ? 'border-green-500 bg-green-50/30' : 
                  validationError ? 'border-red-500 bg-red-50/30' : 
                  'border-lavender hover:border-deep-purple'}
                focus:outline-none focus:border-deep-purple focus:ring-2 focus:ring-deep-purple/20
                text-sm sm:text-base`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {/* Show/Hide Button */}
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-gray-400 hover:text-deep-purple transition-colors rounded-lg hover:bg-deep-purple/5"
                title={showApiKey ? "Hide Key" : "Show Key"}
              >
                {showApiKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>

              {/* Copy Button - Only show when key exists */}
              {apiKey && (
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className={`p-2 transition-colors rounded-lg ${
                    copySuccess 
                      ? 'text-green-500 bg-green-50' 
                      : 'text-gray-400 hover:text-deep-purple hover:bg-deep-purple/5'
                  }`}
                  title="Copy Key"
                >
                  {copySuccess ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              )}

              {/* Clear Button - Only show when key exists */}
              {(apiKey || isValid) && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Clear Key"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Validate Button */}
              <button
                type="submit"
                disabled={isValidating || !apiKey}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 
                  ${isValidating ? 'bg-gray-400' :
                    isValid ? 'bg-green-500 hover:bg-green-600' :
                    'bg-gradient-to-r from-deep-purple to-medium-purple hover:opacity-90'
                  } text-white shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1
                  disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[80px]`}
              >
                {isValidating ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="hidden sm:inline">Validating...</span>
                  </span>
                ) : isValid ? (
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">Valid</span>
                  </span>
                ) : (
                  'Validate'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 text-red-600 text-sm animate-fadeIn bg-red-50/50 p-3 rounded-lg border border-red-200">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{validationError}</p>
          </div>
        )}

        {/* Account Info */}
        {isValid && accountInfo && (
          <div className="flex flex-col gap-2 text-sm animate-fadeIn bg-green-50/50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between text-green-700">
              <span className="font-medium">Account Status:</span>
              <span className="bg-green-100 px-2 py-1 rounded text-green-800">Active</span>
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span className="font-medium">Time Remaining:</span>
              <span className="bg-green-100 px-2 py-1 rounded text-green-800">{accountInfo.freeTimeRemaining}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
