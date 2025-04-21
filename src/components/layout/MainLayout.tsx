'use client';

import { useState, useEffect, ReactNode } from 'react';
import HeroSection from '../sections/HeroSection';
import ProjectsSection from '../sections/ProjectsSection';
import ArticlesSection from '../sections/ArticlesSection';
import GraphsSection from '../sections/GraphsSection';

interface BorderSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface CollapsibleProps {
  children: ReactNode;
  defaultOpen?: boolean;
  isSmallPhone: boolean;
}

export default function MainLayout() {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Breakpoints
  const isSmallPhone = windowWidth <= 480;  // Very small devices
  const isMobile = windowWidth <= 767;      // Mobile devices (including small phones)
  const isTablet = windowWidth > 767 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const BorderSection = ({ title, children, className = "" }: BorderSectionProps) => (
    <div className={`relative border border-[#AEAEAE] border-opacity-15 p-6 ${className}`}>
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black px-2">
        <span className="text-lg text-[#256B2D] font-bold">{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-[#256B2D] overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 w-full">
        
        {isDesktop && (
          <div className="flex flex-col gap-8 w-full">
            <BorderSection title="intro" className="w-full">
              <HeroSection />
            </BorderSection>
            <div className="flex gap-6 w-full">
              <BorderSection title="projects" className="w-2/3">
                <ProjectsSection />
              </BorderSection>
              <BorderSection title="articles" className="w-1/3">
                <ArticlesSection />
              </BorderSection>
            </div>
            <BorderSection title="skills" className="w-full">
              <GraphsSection />
            </BorderSection>
          </div>
        )}
        
        {isTablet && (
          <div className="flex flex-col gap-6 w-full">
            <BorderSection title="intro"><HeroSection /></BorderSection>
            <BorderSection title="projects"><ProjectsSection /></BorderSection>
            <BorderSection title="skills"><GraphsSection /></BorderSection>
            <BorderSection title="articles"><ArticlesSection /></BorderSection>
          </div>
        )}
        
        {isMobile && (
          <div className="flex flex-col gap-4 w-full">
            <BorderSection title="intro">
              <Collapsible defaultOpen={true} isSmallPhone={isSmallPhone}>
                <HeroSection />
              </Collapsible>
            </BorderSection>

            <BorderSection title="projects">
              <Collapsible defaultOpen={true} isSmallPhone={isSmallPhone}>
                <ProjectsSection />
              </Collapsible>
            </BorderSection>

            <BorderSection title="skills">
              <Collapsible defaultOpen={false} isSmallPhone={isSmallPhone}>
                <GraphsSection />
              </Collapsible>
            </BorderSection>

            <BorderSection title="articles">
              <Collapsible defaultOpen={false} isSmallPhone={isSmallPhone}>
                <ArticlesSection />
              </Collapsible>
            </BorderSection>
          </div>
        )}
      </div>
    </div>
  );
}

function Collapsible({ children, defaultOpen = false, isSmallPhone }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  if (isSmallPhone) {
    return <>{children}</>;
  }

  return (
    <div>
      <div 
        className="flex justify-end cursor-pointer mb-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#256B2D]">
          {isOpen ? '▲' : '▼'} {!isOpen && <span className="text-sm opacity-70">tap to expand</span>}
        </span>
      </div>
      
      {isOpen ? children : (
        <div className="h-12 flex items-center justify-center">
          <span className="text-[#256B2D] opacity-50">Content collapsed</span>
        </div>
      )}
    </div>
  );
}