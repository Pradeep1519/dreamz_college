// src/counselor/components/CallButton.tsx

import { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Clock } from 'lucide-react';

interface CallButtonProps {
  phoneNumber: string;
  name: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onCallLog?: (status: string, duration: string) => void;
}

export function CallButton({ phoneNumber, name, onCallStart, onCallEnd, onCallLog }: CallButtonProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const startCall = () => {
    setIsCalling(true);
    onCallStart?.();
    
    // Start timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    // Open phone dialer
    window.open(`tel:+91${phoneNumber}`, '_blank');
  };

  const endCall = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    onCallLog?.('completed', durationString);
    onCallEnd?.();
    
    setIsCalling(false);
    setCallDuration(0);
    setTimerInterval(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCalling) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white text-xl font-bold mb-1">Calling {name}...</h3>
          <p className="text-gray-400 text-sm mb-6">{phoneNumber}</p>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-white text-2xl font-mono">
              {formatTime(callDuration)}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={toggleMute}
              className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition"
            >
              {isMuted ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
            
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
          
          <p className="text-gray-500 text-xs mt-8">Tap end call when done</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startCall}
      className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-medium w-full"
    >
      <Phone className="w-4 h-4" />
      Call Now
    </button>
  );
}