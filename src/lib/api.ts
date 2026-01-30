
import type { ScanResult, AccessibilityIssue, ComplianceBadge, Severity, ScoreCategory } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

export const scanWebsite = async (url: string): Promise<ScanResult> => {
    const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error('Failed to scan website');
    }

    const data = await response.json();
    return transformResponse(data, url);
};

const transformResponse = (data: any, url: string): ScanResult => {
    const issues: AccessibilityIssue[] = data.issues.map((issue: any) => ({
        id: issue.id,
        title: issue.description, // Mapping description to title as it's a short summary
        wcagRule: issue.wcag_rule.split('(')[0].trim(),
        wcagLevel: 'AA', // Defaulting to AA as backend doesn't explicitly return level in a clean way yet
        explanation: issue.explanation,
        affectedGroups: issue.affected_users,
        suggestedFix: issue.fix_steps || [],
        codeSnippet: issue.fix_code || '',
        severity: mapSeverity(issue.impact),
    }));

    const complianceBadges: ComplianceBadge[] = data.badges.map((badge: string, index: number) => ({
        id: `badge-${index}`,
        label: badge,
        description: badge,
        type: badge.includes('Compliant') ? 'success' : badge.includes('Non-Compliant') ? 'warning' : 'info',
    }));

    return {
        url,
        score: data.score,
        category: getScoreCategory(data.score),
        issues,
        complianceBadges,
        scanDate: new Date().toISOString(),
        techStack: data.techStack || 'Unknown',
    };
};

const mapSeverity = (impact: string): Severity => {
    switch (impact) {
        case 'critical':
            return 'critical';
        case 'serious':
            return 'moderate'; // Mapping serious to moderate as per frontend types
        case 'moderate':
            return 'moderate';
        case 'minor':
            return 'minor';
        default:
            return 'minor';
    }
};

const getScoreCategory = (score: number): ScoreCategory => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
};
