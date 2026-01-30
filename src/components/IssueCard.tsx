'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Users, AlertTriangle, Info, AlertCircle, Copy, Check } from 'lucide-react';
import type { AccessibilityIssue, Severity } from '@/types';

interface IssueCardProps {
  issue: AccessibilityIssue;
  index: number;
  techStack?: string;
}

const severityConfig: Record<Severity, { icon: typeof AlertCircle; color: string; label: string }> = {
  critical: {
    icon: AlertCircle,
    color: '#FF0055',
    label: 'Critical',
  },
  moderate: {
    icon: AlertTriangle,
    color: '#FFD700',
    label: 'Moderate',
  },
  minor: {
    icon: Info,
    color: '#00F0FF',
    label: 'Minor',
  },
};

export function IssueCard({ issue, techStack = 'Unknown' }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // CMS Detection
  const isCMS = ['wordpress', 'wix', 'squarespace', 'webflow', 'shopify'].includes(techStack.toLowerCase());
  const [showCode, setShowCode] = useState(!isCMS);

  const severity = severityConfig[issue.severity];
  const SeverityIcon = severity.icon;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(issue.codeSnippet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      console.error('Failed to copy code');
    }
  };

  return (
    <article
      className={`nx-card nx-card-hover overflow-hidden transition-all duration-300 ${issue.severity === 'critical'
        ? 'severity-critical'
        : issue.severity === 'moderate'
          ? 'severity-moderate'
          : 'severity-minor'
        }`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: severity.color,
      }}
    >
      {/* Card Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-5 flex items-start justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] focus-visible:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`issue-content-${issue.id}`}
        id={`issue-header-${issue.id}`}
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded"
              style={{
                backgroundColor: `${severity.color}20`,
                color: severity.color,
              }}
            >
              <SeverityIcon size={14} aria-hidden="true" />
              {severity.label}
            </span>
            <span className="wcag-badge" title={`WCAG ${issue.wcagLevel} requirement`}>
              {issue.wcagRule}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[#E0E0E0] font-['Rajdhani']">
            {issue.title}
          </h3>
        </div>
        <div className="flex items-center text-[#00F0FF]">
          {isExpanded ? (
            <ChevronUp size={24} aria-hidden="true" />
          ) : (
            <ChevronDown size={24} aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id={`issue-content-${issue.id}`}
        role="region"
        aria-labelledby={`issue-header-${issue.id}`}
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 pb-4 md:px-5 md:pb-5 space-y-4">
          {/* Explanation */}
          <div>
            <h4 className="text-sm font-semibold text-[#00F0FF] mb-2 font-['Rajdhani']">
              Why This Matters
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {issue.explanation}
            </p>
          </div>

          {/* Affected User Groups */}
          <div>
            <h4 className="text-sm font-semibold text-[#00F0FF] mb-2 flex items-center gap-2 font-['Rajdhani']">
              <Users size={16} aria-hidden="true" />
              Affected User Groups
            </h4>
            <ul className="flex flex-wrap gap-2">
              {issue.affectedGroups.map((group, idx) => (
                <li
                  key={idx}
                  className="text-xs px-3 py-1.5 bg-[#1A1A24] border border-[#2A2A35] rounded-full text-gray-300"
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Fix (Smart Steps) */}
          <div>
            <h4 className="text-sm font-semibold text-[#00F0FF] mb-2 font-['Rajdhani']">
              {isCMS ? `How to Fix (${techStack})` : 'How to Fix'}
            </h4>
            {Array.isArray(issue.suggestedFix) ? (
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300 leading-relaxed">
                {issue.suggestedFix.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">{issue.suggestedFix}</p>
            )}
          </div>

          {/* Code Snippet (Toggle for CMS) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-sm font-semibold text-[#00F0FF] flex items-center gap-2 font-['Rajdhani'] focus:outline-none hover:underline"
              >
                <Code size={16} aria-hidden="true" />
                {showCode ? 'Hide Code Example' : 'Show Developer Code'}
                {!showCode && <span className="text-xs text-gray-500 font-normal">(Advanced)</span>}
              </button>

              {showCode && (
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-[#1A1A24] border border-[#2A2A35] rounded text-gray-300 hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                  aria-label="Copy code example"
                  title="Copy code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {showCode && (
              <pre className="bg-[#05050A] border border-[#2A2A35] rounded-lg p-4 overflow-x-auto animate-in fade-in slide-in-from-top-1">
                <code className="text-sm font-mono text-gray-300">
                  {issue.codeSnippet || '// No specific code fix available.'}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default IssueCard;
