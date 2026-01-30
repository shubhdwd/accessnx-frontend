import type { ScanResult, AccessibilityIssue, ComplianceBadge } from '@/types';

export const mockIssues: AccessibilityIssue[] = [
  {
    id: '1',
    title: 'Missing Alternative Text on Images',
    wcagRule: '1.1.1',
    wcagLevel: 'A',
    explanation: 'Images without alt text cannot be described by screen readers, making visual content inaccessible to blind users who rely on assistive technologies to understand webpage content.',
    affectedGroups: ['Screen reader users', 'Blind users', 'Low vision users'],
    suggestedFix: ['Add descriptive alt attributes to all meaningful images.', 'Use empty alt="" for decorative images.'],
    codeSnippet: `<img src="chart.png" alt="Bar chart showing Q4 sales increased by 25%" />
<img src="decoration.jpg" alt="" />`,
    severity: 'critical',
  },
  {
    id: '2',
    title: 'Insufficient Color Contrast',
    wcagRule: '1.4.3',
    wcagLevel: 'AA',
    explanation: 'Text with low contrast against its background is difficult to read for users with low vision, color blindness, or those viewing content in bright sunlight.',
    affectedGroups: ['Low vision users', 'Color blind users', 'Users in bright environments'],
    suggestedFix: ['Ensure text contrast ratio is at least 4.5:1 for normal text and 3:1 for large text.', 'Use contrast checking tools.'],
    codeSnippet: `/* Before - Poor contrast */
.text { color: #888; background: #fff; }

/* After - Good contrast (7:1 ratio) */
.text { color: #333; background: #fff; }`,
    severity: 'critical',
  },
  {
    id: '3',
    title: 'Missing Form Labels',
    wcagRule: '1.3.1',
    wcagLevel: 'A',
    explanation: 'Form inputs without associated labels are unclear to screen reader users, who cannot determine what information is being requested.',
    affectedGroups: ['Screen reader users', 'Blind users', 'Cognitive disability users'],
    suggestedFix: ['Use the label element with for attribute matching the input id, or wrap the input in a label.'],
    codeSnippet: `<!-- Correct approach -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" />

<!-- Alternative -->
<label>
  Email Address
  <input type="email" name="email" />
</label>`,
    severity: 'moderate',
  },
  {
    id: '4',
    title: 'Keyboard Navigation Issues',
    wcagRule: '2.1.1',
    wcagLevel: 'A',
    explanation: 'Interactive elements that cannot be accessed via keyboard exclude users who cannot use a mouse, including those with motor disabilities and power users.',
    affectedGroups: ['Motor disability users', 'Keyboard-only users', 'Power users'],
    suggestedFix: ['Ensure all interactive elements are focusable and operable using Tab, Enter, Space, and Arrow keys.', 'Avoid keyboard traps.'],
    codeSnippet: `<!-- Use native button instead of div -->
<!-- Bad: Not keyboard accessible -->
<div onclick="submit()">Submit</div>

<!-- Good: Native keyboard support -->
<button onclick="submit()">Submit</button>`,
    severity: 'critical',
  },
  {
    id: '5',
    title: 'Missing Heading Hierarchy',
    wcagRule: '1.3.1',
    wcagLevel: 'A',
    explanation: 'Improper heading structure makes it difficult for screen reader users to navigate and understand the content organization of the page.',
    affectedGroups: ['Screen reader users', 'Blind users', 'Cognitive disability users'],
    suggestedFix: ['Use one h1 per page, followed by h2, h3 in logical order.', 'Do not skip heading levels.'],
    codeSnippet: `<!-- Correct hierarchy -->
<h1>Main Page Title</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>
<h2>Another Section</h2>`,
    severity: 'moderate',
  },
  {
    id: '6',
    title: 'Missing Focus Indicators',
    wcagRule: '2.4.7',
    wcagLevel: 'AA',
    explanation: 'Without visible focus indicators, keyboard users cannot determine which element currently has focus, making navigation extremely difficult.',
    affectedGroups: ['Keyboard-only users', 'Motor disability users', 'Low vision users'],
    suggestedFix: ['Ensure all focusable elements have visible focus styles.', 'Do not remove default focus outlines without providing alternatives.'],
    codeSnippet: `/* Add visible focus styles */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid #00F0FF;
  outline-offset: 2px;
}`,
    severity: 'moderate',
  },
  {
    id: '7',
    title: 'Missing ARIA Labels on Icons',
    wcagRule: '4.1.2',
    wcagLevel: 'A',
    explanation: 'Icon-only buttons without accessible names are meaningless to screen reader users, who hear only "button" without context.',
    affectedGroups: ['Screen reader users', 'Blind users'],
    suggestedFix: ['Add aria-label attributes to icon-only buttons, or use visually hidden text.'],
    codeSnippet: `<!-- Icon-only button with accessible name -->
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>

<!-- Alternative with visually hidden text -->
<button>
  <svg><!-- Search icon --></svg>
  <span class="visually-hidden">Search</span>
</button>`,
    severity: 'minor',
  },
  {
    id: '8',
    title: 'Missing Status Announcements',
    wcagRule: '4.1.3',
    wcagLevel: 'AA',
    explanation: 'Dynamic content changes that are not announced to screen readers leave users unaware of important status updates and results.',
    affectedGroups: ['Screen reader users', 'Blind users'],
    suggestedFix: ['Use ARIA live regions to announce status changes, loading states, and results to assistive technologies.'],
    codeSnippet: `<!-- Live region for status announcements -->
<div role="status" aria-live="polite" aria-atomic="true">
  <p>Scan completed. 5 issues found.</p>
</div>

<!-- For loading states -->
<div role="status" aria-live="polite">
  <p>Scanning in progress...</p>
</div>`,
    severity: 'minor',
  },
];

export const complianceBadges: ComplianceBadge[] = [
  {
    id: '1',
    label: 'WCAG A Coverage',
    description: 'Meets WCAG Level A requirements',
    type: 'success',
  },
  {
    id: '2',
    label: 'Partial WCAG AA Coverage',
    description: 'Partially meets WCAG Level AA requirements',
    type: 'warning',
  },
  {
    id: '3',
    label: 'Automated Checks Only',
    description: 'Results based on automated testing only',
    type: 'info',
  },
];

export const generateMockResult = (url: string): ScanResult => {
  // Calculate score based on number of issues
  const criticalCount = mockIssues.filter(i => i.severity === 'critical').length;
  const moderateCount = mockIssues.filter(i => i.severity === 'moderate').length;
  const minorCount = mockIssues.filter(i => i.severity === 'minor').length;

  const score = Math.max(0, 100 - (criticalCount * 15) - (moderateCount * 8) - (minorCount * 3));

  let category: ScanResult['category'];
  if (score >= 90) category = 'excellent';
  else if (score >= 70) category = 'good';
  else if (score >= 50) category = 'needs-improvement';
  else category = 'poor';

  return {
    url,
    score: Math.round(score),
    category,
    issues: mockIssues.map(i => ({ ...i, suggestedFix: [i.suggestedFix] as any })), // simple cast for mock fix
    complianceBadges,
    scanDate: new Date().toISOString(),
    techStack: 'Mock Tech Stack', // Mock value
  };
};

export default generateMockResult;
