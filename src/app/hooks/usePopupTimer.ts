// src/app/hooks/usePopupTimer.ts

import { useState, useEffect, useCallback, useRef } from 'react';

export function usePopupTimer(intervalSeconds: number = 20) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user has already submitted the form (permanent)
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      // Show popup after 2 seconds on page load
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(initialTimer);
    }
  }, []);

  const showPopup = useCallback(() => {
    const hasSubmitted = localStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      setIsOpen(true);
    }
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Show popup again after specified seconds (only if not submitted)
    const hasSubmitted = localStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      timerRef.current = setTimeout(() => {
        showPopup();
      }, intervalSeconds * 1000);
    }
  }, [intervalSeconds, showPopup]);

  const markAsSubmitted = useCallback(() => {
    // Mark as permanently submitted - will never show again
    localStorage.setItem('leadPopupSubmitted', 'true');
    setIsOpen(false);
    
    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    isOpen,
    closePopup,
    markAsSubmitted
  };
}