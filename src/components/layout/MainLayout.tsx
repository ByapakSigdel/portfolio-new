'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
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

const sectionVariants = {
  hover: {
    scale: 1.01, // Reduced scale effect
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  initial: {
    scale: 1,
    background: 'rgba(37, 107, 45, 0)'
  }
};

const glowVariants = {
  hover: {
    opacity: 0.2,
    transition: { duration: 0.3 }
  },
  initial: {
    opacity: 0
  }
};

export default function MainLayout() {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Breakpoints
  const isSmallPhone = windowWidth <= 480;
  const isMobile = windowWidth <= 767;
  const isTablet = windowWidth > 767 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  const BorderSection = ({ title, children, className = "" }: BorderSectionProps) => (
    <motion.div
      className={`relative border border-[#AEAEAE] border-opacity-15 p-3 md:p-4 ${className}`} // Reduced padding
      variants={sectionVariants}
      whileHover="hover"
      initial="initial"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,107,45,0.2)_0%,transparent_70%)]"
        variants={glowVariants}
      />
      
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black px-2">
        <span className="text-sm md:text-base text-[#256B2D] font-bold">{title}</span> {/* Reduced font size */}
      </div>
      
      <motion.div
        whileHover={{ scale: 1.005 }} // Minimal scale effect
        transition={{ type: "spring", stiffness: 400 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-[#256B2D] overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-2 py-4 w-full"> {/* Reduced padding and max width */}
        
        {isDesktop && (
          <div className="flex flex-col gap-4 w-full"> {/* Reduced gap */}
            <BorderSection title="intro" className="w-full">
              <HeroSection />
            </BorderSection>
            
            <div className="flex gap-4 w-full"> {/* Reduced gap */}
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
          <div className="flex flex-col gap-4 w-full"> {/* Reduced gap */}
            <BorderSection title="intro"><HeroSection /></BorderSection>
            <BorderSection title="projects"><ProjectsSection /></BorderSection>
            <BorderSection title="skills"><GraphsSection /></BorderSection>
            <BorderSection title="articles"><ArticlesSection /></BorderSection>
          </div>
        )}
        
        {isMobile && (
          <div className="flex flex-col gap-3 w-full"> {/* Reduced gap */}
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
    <motion.div
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="flex justify-end cursor-pointer mb-1" // Reduced margin
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.span 
          className="text-[#256B2D] text-xs" // Reduced text size
          whileHover={{ scale: 1.05 }} // Reduced hover effect
        >
          {isOpen ? '▲' : '▼'} {!isOpen && <span className="text-xs opacity-70">tap to expand</span>}
        </motion.span>
      </div>
      
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 32 }} // Reduced collapsed height
        transition={{ type: "spring", stiffness: 300 }}
        className="overflow-hidden"
      >
        {isOpen ? children : (
          <div className="h-8 flex items-center justify-center"> {/* Reduced height */}
            <span className="text-[#256B2D] opacity-50 text-xs">Content collapsed</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}