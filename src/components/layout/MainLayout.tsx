'use client';

import { useState, useEffect, ReactNode } from 'react';
import HeroSection from '../sections/HeroSection';
import ProjectsSection from '../sections/ProjectsSection';
import ArticlesSection from '../sections/ArticlesSection';
import GraphsSection from '../sections/GraphsSection';

// Define interface for BorderSection props
interface BorderSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function MainLayout() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Update width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine layout based on screen size
  const isMobile = windowWidth <= 767; // iPhone
  const isTablet = windowWidth > 767 && windowWidth <= 1024; // iPad Pro
  const isDesktop = windowWidth > 1024; // Desktop
  
  // Common section styling with border title on top right
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
      {/* The container wraps everything with appropriate padding */}
      <div className="max-w-screen-2xl mx-auto px-4 py-8 w-full">
        
        {/* Desktop Layout */}
        {isDesktop && (
          <div className="flex flex-col gap-8 w-full">
            {/* Intro Section */}
            <BorderSection title="intro" className="w-full">
              <HeroSection />
            </BorderSection>
            
            {/* Projects and Articles Row */}
            <div className="flex gap-6 w-full">
              {/* Projects Section - Takes 2/3 width */}
              <BorderSection title="projects" className="w-2/3">
                <ProjectsSection />
              </BorderSection>
              
              {/* Articles Section - Takes 1/3 width */}
              <BorderSection title="articles" className="w-1/3">
                <ArticlesSection />
              </BorderSection>
            </div>
            
            {/* Skills/Graphs Section */}
            <BorderSection title="skills" className="w-full">
              <GraphsSection />
            </BorderSection>
          </div>
        )}
        
        {/* Tablet Layout (iPad Pro) */}
        {isTablet && (
          <div className="flex flex-col gap-6 w-full">
            {/* Intro Section */}
            <BorderSection title="intro">
              <HeroSection />
            </BorderSection>
            
            {/* Projects Section */}
            <BorderSection title="projects">
              <ProjectsSection />
            </BorderSection>
            
            {/* Skills/Graphs Section */}
            <BorderSection title="skills">
              <GraphsSection />
            </BorderSection>
            
            {/* Articles Section */}
            <BorderSection title="articles">
              <ArticlesSection />
            </BorderSection>
          </div>
        )}
        
        {/* Mobile Layout (iPhone) */}
        {isMobile && (
          <div className="flex flex-col gap-4 w-full">
            {/* Intro Section - Collapsed by default */}
            <BorderSection title="intro">
              <div className="flex justify-end">
                <span>▼</span>
              </div>
              <HeroSection />
            </BorderSection>
            
            {/* Projects Section */}
            <BorderSection title="projects">
              <ProjectsSection />
            </BorderSection>
            
            {/* Skills/Graphs Section */}
            <BorderSection title="skills">
              <div className="h-24 flex items-center justify-center">
                <span className="text-[#256B2D] opacity-50">tap to view skills</span>
              </div>
            </BorderSection>
            
            {/* Articles Section */}
            <BorderSection title="articles">
              <div className="h-24 flex items-center justify-center">
                <span className="text-[#256B2D] opacity-50">tap to view articles</span>
              </div>
            </BorderSection>
          </div>
        )}
      </div>
    </div>
  );
}