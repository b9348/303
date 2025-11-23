
import React, { useState, useEffect, useRef } from 'react';
import { AudioManager } from '../utils/AudioManager';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  forceShow?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, onComplete, forceShow }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<any>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef current to avoid restarting effect when parent re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Handle forced completion
    if (forceShow) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(text);
      // Ensure we mark as complete
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Normal typing initialization
    setDisplayedText('');
    indexRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        // Use charAt to ensure we get the character from the current text prop
        const char = text.charAt(indexRef.current);
        setDisplayedText((prev) => prev + char);
        
        // Play sound every few chars or always? Let's do every char but ensure it's performant
        // Randomize skip slightly to sound more natural/less machine-gun like
        if (Math.random() > 0.3) {
            AudioManager.getInstance().playTypeSound();
        }

        indexRef.current++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, forceShow]);

  return (
    <span className="whitespace-pre-wrap leading-relaxed font-serif-sc text-lg md:text-xl tracking-wider">
      {displayedText}
      {/* Only show cursor if typing is in progress and not complete */}
      {displayedText.length < text.length && (
        <span className="animate-pulse inline-block w-2 h-5 ml-1 bg-red-800 align-middle shadow-[0_0_8px_rgba(153,27,27,0.8)]"></span>
      )}
    </span>
  );
};
