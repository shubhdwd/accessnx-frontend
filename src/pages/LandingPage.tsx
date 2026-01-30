'use client';

import React from "react"

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Search, FileSearch, Wrench, Shield } from 'lucide-react';
import { FluidBackground } from '@/components/FluidBackground';
import { TextScramble } from '@/components/TextScramble';
import { FeatureCard } from '@/components/FeatureCard';

interface LandingPageProps {
  onStartScan: () => void;
}

const features = [
  {
    id: '1',
    title: 'AI-Powered Detection',
    description: 'Identifies visual and structural barriers using advanced accessibility analysis algorithms.',
    icon: 'brain' as const,
  },
  {
    id: '2',
    title: 'WCAG 2.1 Mapping',
    description: 'Instantly maps detected issues to specific WCAG success criteria for compliance reporting.',
    icon: 'checklist' as const,
  },
  {
    id: '3',
    title: 'Instant Remediation',
    description: 'Generates semantic code fixes and ARIA attributes with clear implementation guidance.',
    icon: 'code' as const,
  },
];

const steps = [
  {
    number: '01',
    title: 'Enter URL',
    description: 'Input any public website URL you want to analyze.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Automated Scan',
    description: 'AccessNX scans the site using WCAG-based automated checks.',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Get Results',
    description: 'Receive an accessibility score, issue breakdown, and fix suggestions.',
    icon: Wrench,
  },
];

export function LandingPage({ onStartScan }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    // Animate hero content on load
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Cycle through features automatically
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onStartScan();
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A]" ref={contentRef}>
      {/* Skip Link - WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header - Sticky navbar that stays visible while scrolling */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-[#05050A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-[#05050A]" strokeWidth={2.5} aria-hidden="true" />
            </div>
            {/* Logo Text */}
            <h1 className="text-2xl font-bold text-[#00F0FF] font-['Rajdhani'] tracking-wider">
              AccessNX
            </h1>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section - height excludes navbar */}
        <section
          ref={heroRef}
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: 'calc(100vh - 72px)' }}
          aria-labelledby="hero-heading"
        >
          {/* WebGL Background - contained within hero section */}
          <FluidBackground />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto hero-content">
            <h2
              id="hero-heading"
              className="text-4xl md:text-7xl font-bold mb-6 text-[#E0E0E0] font-['Rajdhani']"
            >
              <TextScramble text="AccessNX" delay={0.5} />
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              Next-Generation Web Accessibility Analysis
            </p>
            <p className="text-base text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-assisted platform that identifies accessibility issues, explains their real-world impact,
              and suggests actionable fixes based on WCAG standards.
            </p>
            <button
              onClick={onStartScan}
              onKeyDown={handleKeyDown}
              className="nx-btn-primary text-lg flex items-center gap-3 mx-auto group"
              aria-label="Start accessibility scan"
            >
              <span>Start Accessibility Scan</span>
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-6 bg-[#0A0A0F]" aria-labelledby="steps-heading">
          <div className="max-w-6xl mx-auto">
            <h2
              id="steps-heading"
              className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#E0E0E0] font-['Rajdhani']"
            >
              Steps
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Step Number */}
                    <div className="w-16 h-16 rounded-full bg-[#0F0F14] border-2 border-[#00F0FF] flex items-center justify-center mb-6">
                      <StepIcon size={28} className="text-[#00F0FF]" aria-hidden="true" />
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#00F0FF]/50 to-transparent"
                        aria-hidden="true"
                      />
                    )}

                    <span className="text-4xl font-bold text-[#00F0FF]/30 font-['Rajdhani'] mb-2">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold text-[#E0E0E0] mb-3 font-['Rajdhani']">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#E0E0E0] font-['Rajdhani']"
            >
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  index={index}
                  isActive={activeFeature === index}
                />
              ))}
            </div>

            {/* Feature indicators */}
            <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Feature carousel">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeFeature === index
                    ? 'w-8 bg-[#00F0FF]'
                    : 'bg-[#2A2A35] hover:bg-[#00F0FF]/50'
                    }`}
                  role="tab"
                  aria-selected={activeFeature === index}
                  aria-label={`View feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-[#0A0A0F] to-[#05050A]" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl font-bold mb-6 text-[#E0E0E0] font-['Rajdhani']"
            >
              Ready to Analyze Your Website?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Get instant insights into your website's accessibility compliance and receive
              actionable recommendations for improvement.
            </p>
            <button
              onClick={onStartScan}
              onKeyDown={handleKeyDown}
              className="nx-btn-primary text-lg flex items-center gap-3 mx-auto group"
              aria-label="Start accessibility scan now"
            >
              <span>Start Accessibility Scan</span>
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2A2A35]" role="contentinfo">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            AccessNX provides automated WCAG-based accessibility insights and does not replace manual audits.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            © {new Date().getFullYear()} AccessNX. Built with accessibility in mind.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
