import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function TextScramble({
  text,
  className = '',
  delay = 0,
  duration = 1.2,
}: TextScrambleProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0;
      const totalIterations = text.length * 3;
      
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration / 3) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        iteration++;
        
        if (iteration >= totalIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, (duration * 1000) / totalIterations);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text, delay, duration]);
  
  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay, ease: 'expo.out' }
      );
    }
  }, [delay]);
  
  return (
    <span ref={elementRef} className={`scramble-text ${className}`} aria-label={text}>
      {displayText || text.split('').map(() => '\u00A0').join('')}
    </span>
  );
}

export default TextScramble;
