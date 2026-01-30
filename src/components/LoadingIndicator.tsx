import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Scan } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({
  message = 'Scanning website for accessibility issues...',
}: LoadingIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Rotate the scan icon
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'none',
      });
    }
    
    // Pulse animation for the container
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0.7,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
    
    return () => {
      gsap.killTweensOf(iconRef.current);
      gsap.killTweensOf(containerRef.current);
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        ref={iconRef}
        className="w-16 h-16 flex items-center justify-center mb-6"
        aria-hidden="true"
      >
        <Scan size={48} className="text-[#00F0FF]" />
      </div>
      <p className="text-lg text-[#E0E0E0] font-medium mb-2">{message}</p>
      <p className="text-sm text-gray-500 text-center max-w-md">
        We scan websites for accessibility issues based on WCAG guidelines using
        axe-core, an industry-standard accessibility testing engine.
      </p>
      <div className="mt-6 flex gap-2" aria-hidden="true">
        <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default LoadingIndicator;
