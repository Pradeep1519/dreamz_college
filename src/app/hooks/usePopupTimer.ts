import { useState, useEffect, useCallback, useRef } from 'react';

export function usePopupTimer(intervalSeconds: number = 59) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownRef = useRef(false);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('leadPopupSubmitted');
    if (saved === 'true') {
      setHasSubmitted(true);
    }
  }, []);

  const showPopup = useCallback(() => {
    // Don't show if user already submitted
    if (hasSubmitted) return;
    setIsOpen(true);
  }, [hasSubmitted]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set next popup after 40 seconds (only if not submitted)
    if (!hasSubmitted) {
      timerRef.current = setTimeout(() => {
        showPopup();
      }, intervalSeconds * 1000);
    }
  }, [intervalSeconds, hasSubmitted, showPopup]);

  const markAsSubmitted = useCallback(() => {
    setHasSubmitted(true);
    localStorage.setItem('leadPopupSubmitted', 'true');
    setIsOpen(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // Initial popup after 2 seconds
  useEffect(() => {
    if (hasSubmitted) return;
    
    const initialTimer = setTimeout(() => {
      if (!hasShownRef.current && !hasSubmitted) {
        hasShownRef.current = true;
        showPopup();
      }
    }, 2000);
    
    return () => clearTimeout(initialTimer);
  }, [showPopup, hasSubmitted]);

  return {
    isOpen,
    closePopup,
    markAsSubmitted
  };
}