// src/app/hooks/usePopupTimer.ts

import { useState, useEffect, useCallback, useRef } from 'react';

export function usePopupTimer(intervalSeconds: number = 15) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user has submitted in this session only
  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(initialTimer);
    }
  }, []);

  const showPopup = useCallback(() => {
    const hasSubmitted = sessionStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      setIsOpen(true);
    }
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const hasSubmitted = sessionStorage.getItem('leadPopupSubmitted') === 'true';
    
    if (!hasSubmitted) {
      timerRef.current = setTimeout(() => {
        showPopup();
      }, intervalSeconds * 1000);
    }
  }, [intervalSeconds, showPopup]);

  const markAsSubmitted = useCallback(() => {
    sessionStorage.setItem('leadPopupSubmitted', 'true');
    setIsOpen(false);
    
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