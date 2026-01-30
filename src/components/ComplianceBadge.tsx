import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { ComplianceBadge as ComplianceBadgeType } from '@/types';

interface ComplianceBadgeProps {
  badge: ComplianceBadgeType;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'rgba(0, 255, 136, 0.15)',
    borderColor: 'rgba(0, 255, 136, 0.4)',
    textColor: '#00FF88',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    textColor: '#FFD700',
  },
  info: {
    icon: Info,
    bgColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: 'rgba(0, 240, 255, 0.4)',
    textColor: '#00F0FF',
  },
};

export function ComplianceBadge({ badge }: ComplianceBadgeProps) {
  const config = typeConfig[badge.type];
  const Icon = config.icon;
  
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
      title={badge.description}
    >
      <Icon size={18} style={{ color: config.textColor }} aria-hidden="true" />
      <span
        className="text-sm font-medium"
        style={{ color: config.textColor }}
      >
        {badge.label}
      </span>
    </div>
  );
}

export default ComplianceBadge;
