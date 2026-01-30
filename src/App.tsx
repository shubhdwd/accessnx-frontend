import { useState, useEffect } from 'react';
import { LandingPage } from '@/pages/LandingPage';
import { ScannerPage } from '@/pages/ScannerPage';
import './App.css';

type Page = 'landing' | 'scanner';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  
  // Handle initial page load - check for hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#scanner') {
      setCurrentPage('scanner');
    }
  }, []);
  
  // Update URL hash when page changes
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);
  
  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#scanner') {
        setCurrentPage('scanner');
      } else {
        setCurrentPage('landing');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const handleStartScan = () => {
    setCurrentPage('scanner');
  };
  
  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };
  
  return (
    <div className="min-h-screen bg-[#05050A]">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#00F0FF] focus:text-[#05050A] focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
      >
        Skip to main content
      </a>
      
      <main id="main-content" role="main">
        {currentPage === 'landing' ? (
          <LandingPage onStartScan={handleStartScan} />
        ) : (
          <ScannerPage onBack={handleBackToLanding} />
        )}
      </main>
    </div>
  );
}

export default App;
