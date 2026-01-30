'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Globe, AlertCircle, Share2, Check } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { IssueCard } from '@/components/IssueCard';
import { ComplianceBadge } from '@/components/ComplianceBadge';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { scanWebsite } from '@/lib/api';
import type { ScanResult } from '@/types';

interface ScannerPageProps {
  onBack: () => void;
}

export function ScannerPage({ onBack }: ScannerPageProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isShared, setIsShared] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to results when scan completes
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // Focus error when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const validateUrl = (input: string): boolean => {
    if (!input.trim()) return false;
    try {
      const urlToTest = input.startsWith('http') ? input : `https://${input}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const handleScan = async () => {
    setError(null);
    setResult(null);

    if (!validateUrl(url)) {
      setError('Please enter a valid website URL.');
      return;
    }

    setIsScanning(true);

    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const scanResult = await scanWebsite(formattedUrl);
      setResult(scanResult);
    } catch (err) {
      console.error(err);
      setError('Failed to scan website. Please make sure the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isScanning) {
      handleScan();
    }
  };

  const handleBackKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onBack();
    }
  };

  const handleShareResults = async () => {
    if (!result) return;

    const shareText = `AccessNX Accessibility Scan Report\nURL: ${result.url}\nScore: ${result.score}/100\nIssues: ${result.issues.length}\nScan Date: ${new Date(result.scanDate).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AccessNX Scan Results',
          text: shareText,
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard if Web Share API not available
      try {
        await navigator.clipboard.writeText(shareText);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch {
        console.error('Failed to share results');
      }
    }
  };

  // Sort issues by severity
  const sortedIssues = result?.issues.sort((a, b) => {
    const severityOrder = { critical: 0, moderate: 1, minor: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="min-h-screen bg-[#05050A]">
      {/* Skip Link - WCAG 2.4.1 */}
      <a href="#scanner-main" className="skip-link">
        Skip to main content
      </a>

      {/* Header - Static navbar in normal document flow */}
      <header className="block bg-[#05050A] border-b border-[#2A2A35]" style={{ position: 'static' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            onKeyDown={handleBackKeyDown}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00F0FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050A] rounded-md px-2 py-1"
            aria-label="Back to landing page"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-xl font-bold text-[#00F0FF] font-['Rajdhani'] tracking-wider">
            AccessNX
          </h1>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main id="scanner-main" className="pb-12">
        {/* Input Section */}
        <section className="px-4 md:px-6 py-12" aria-labelledby="scanner-heading">
          <div className="max-w-3xl mx-auto">
            <h1
              id="scanner-heading"
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#E0E0E0] font-['Rajdhani']"
            >
              Accessibility Scanner
            </h1>

            <div className="nx-card p-6 md:p-8">
              {/* URL Input */}
              <div className="mb-6">
                <label
                  htmlFor="url-input"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Website URL
                </label>
                <div className="relative">
                  <Globe
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    className="nx-input pl-12 pr-4"
                    disabled={isScanning}
                    aria-describedby={error ? 'url-error' : undefined}
                    aria-invalid={error ? 'true' : 'false'}
                  />
                </div>
              </div>

              {/* Error Message - WCAG 3.3.1 */}
              {error && (
                <div
                  ref={errorRef}
                  role="alert"
                  aria-live="assertive"
                  className="mb-6 p-4 bg-[#FF0055]/10 border border-[#FF0055]/30 rounded-lg flex items-center gap-3"
                  tabIndex={-1}
                >
                  <AlertCircle size={20} className="text-[#FF0055] flex-shrink-0" aria-hidden="true" />
                  <p id="url-error" className="text-sm text-[#FF0055]">
                    {error}
                  </p>
                </div>
              )}

              {/* Scan Button */}
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full nx-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label={isScanning ? 'Scanning in progress' : 'Scan website accessibility'}
              >
                {isScanning ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#05050A] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <span>Scan Accessibility</span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isScanning && (
          <section className="px-4 md:px-6" aria-live="polite" role="status">
            <div className="max-w-3xl mx-auto">
              <div className="nx-card">
                <LoadingIndicator />
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {result && !isScanning && (
          <div ref={resultsRef} className="px-4 md:px-6 space-y-8">
            {/* Score and Badges */}
            <section className="max-w-6xl mx-auto" aria-labelledby="results-heading">
              <h2 id="results-heading" className="sr-only">
                Scan Results for {result.url}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Card */}
                <div className="nx-card p-8 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-6 font-['Rajdhani']">
                    Accessibility Score
                  </h3>
                  <ScoreGauge
                    score={result.score}
                    category={result.category}
                    size={180}
                    strokeWidth={12}
                  />
                </div>

                {/* Compliance Badges */}
                <div className="nx-card p-8">
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-6 font-['Rajdhani']">
                    Compliance Status
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.complianceBadges.map(badge => (
                      <ComplianceBadge key={badge.id} badge={badge} />
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-[#1A1A24] rounded-lg">
                    <p className="text-sm text-gray-400">
                      <strong className="text-[#E0E0E0]">Scanned URL:</strong>{' '}
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00F0FF] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] rounded"
                      >
                        {result.url}
                      </a>
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      <strong className="text-[#E0E0E0]">Scan Date:</strong>{' '}
                      {new Date(result.scanDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Issues List */}
            <section
              className="max-w-6xl mx-auto"
              aria-labelledby="issues-heading"
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="issues-heading"
                  className="text-2xl font-semibold text-[#E0E0E0] font-['Rajdhani']"
                >
                  Accessibility Issues
                </h2>
                <span className="text-sm text-gray-400">
                  {result.issues.length} issues found
                </span>
              </div>

              {/* Issue Summary */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#FF0055' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-400">
                    {result.issues.filter(i => i.severity === 'critical').length} Critical
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#FFD700' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-400">
                    {result.issues.filter(i => i.severity === 'moderate').length} Moderate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#00F0FF' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-400">
                    {result.issues.filter(i => i.severity === 'minor').length} Minor
                  </span>
                </div>
              </div>

              {/* Issues Grid */}
              <div className="space-y-4">
                {sortedIssues?.map((issue, index) => (
                  <IssueCard key={issue.id} issue={issue} index={index} techStack={result.techStack} />
                ))}
              </div>
            </section>

            {/* Share Button */}
            <section className="max-w-6xl mx-auto flex justify-center">
              <button
                onClick={handleShareResults}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#00F0FF] text-[#00F0FF] font-semibold rounded-md hover:bg-[#00F0FF] hover:text-[#05050A] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050A]"
                aria-label="Share accessibility scan results"
              >
                {isShared ? (
                  <>
                    <Check size={20} aria-hidden="true" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Share2 size={20} aria-hidden="true" />
                    <span>Share Results</span>
                  </>
                )}
              </button>
            </section>

            {/* Disclaimer */}
            <section className="max-w-6xl mx-auto">
              <div className="p-4 bg-[#1A1A24] border border-[#2A2A35] rounded-lg">
                <p className="text-sm text-gray-500 text-center">
                  <strong className="text-gray-400">Note:</strong> This scan uses automated checks only
                  and may not detect all accessibility issues. A manual audit by accessibility experts
                  is recommended for comprehensive WCAG compliance verification.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-[#2A2A35]" role="contentinfo">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            AccessNX provides automated WCAG-based accessibility insights and does not replace manual audits.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ScannerPage;
