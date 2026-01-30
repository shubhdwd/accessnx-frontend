'use client';

import { Brain, ClipboardCheck, Code2 } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: 'brain' | 'checklist' | 'code';
  index: number;
  isActive: boolean;
}

const iconMap = {
  brain: Brain,
  checklist: ClipboardCheck,
  code: Code2,
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className="nx-card p-8 flex flex-col items-center justify-center text-center feature-card-hover group relative h-full"
    >
      {/* Enhanced hover glow background */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1), transparent)',
        }}
      />

      <div
        className="w-16 h-16 flex items-center justify-center rounded-xl mb-4 relative z-10 transition-all duration-300 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.2))',
          border: '1px solid rgba(0, 240, 255, 0.3)',
        }}
      >
        <Icon size={32} className="text-[#00F0FF]" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2 font-['Rajdhani'] relative z-10">
        {title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed relative z-10">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
