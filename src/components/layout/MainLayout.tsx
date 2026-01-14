'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Jost } from 'next/font/google';
import HeroSection from '../sections/HeroSection';
import ProjectsSection from '../sections/ProjectsSection';
import ArticlesSection from '../sections/ArticlesSection';
import GraphsSection from '../sections/GraphsSection';

// Initialize Jost font
const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-jost',
});

interface BorderSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  fixedHeight?: boolean;
  height?: string;
}

interface CollapsibleProps {
  children: ReactNode;
  defaultOpen?: boolean;
  isSmallPhone: boolean;
}

const sectionVariants = {
  hover: {
    scale: 1.01,
    borderColor: 'rgba(37, 107, 45, 0.6)',
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  },
  initial: {
    scale: 1,
    borderColor: 'rgba(174, 174, 174, 0.15)'
  }
};

const glowVariants = {
  hover: {
    opacity: 0.5,
    transition: { duration: 0.3 }
  },
  initial: {
    opacity: 0
  }
};

export default function MainLayout() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // mark mounted to avoid SSR/client layout mismatch
    setMounted(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Breakpoints - only evaluate after mount to avoid hydration mismatches
  const safeWidth = mounted ? windowWidth : 1200; // assume desktop on server
  const isSmallPhone = safeWidth <= 480;
  const isMobile = safeWidth <= 767;
  const isTablet = safeWidth > 767 && safeWidth <= 1024;
  const isDesktop = safeWidth > 1024;

  const BorderSection = ({ title, children, className = "", noPadding = false, fixedHeight = false, height = "400px" }: BorderSectionProps) => (
    <motion.div
      className={`relative ${noPadding ? 'p-0' : 'p-3 md:p-4'} ${className}`}
      variants={sectionVariants}
      whileHover="hover"
      initial="initial"
      style={{ 
        borderStyle: 'solid',
        height: fixedHeight ? height : 'auto',
        borderColor: 'var(--border-soft)'
      }}
    >
      {/* Border Glow Effect */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        variants={glowVariants}
      >
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#256B2D] to-transparent" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#256B2D] to-transparent" />
        <div className="absolute left-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#256B2D] to-transparent" />
        <div className="absolute right-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#256B2D] to-transparent" />
      </motion.div>
      
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black px-2">
        <span className="text-sm md:text-base font-bold" style={{ color: 'var(--accent-strong)' }}>{title}</span>
      </div>
      
      <div 
        className={`${fixedHeight ? 'h-full custom-scrollbar' : ''} ${noPadding ? 'w-full h-full' : ''}`}
        style={{ 
          overflowY: fixedHeight ? 'auto' : 'visible',
          paddingRight: fixedHeight ? '4px' : '0'
        }}
      >
        {children}
      </div>
    </motion.div>
  );

  // Special Hero Section without inner scaling or padding
  const HeroContainer = () => (
    <BorderSection title="intro" className="w-full" noPadding={true}>
      <HeroSection />
    </BorderSection>
  );

  // Calculate appropriate heights based on screen size
  const getProjectsSectionHeight = () => {
    if (isDesktop) return "500px";
    if (isTablet) return "450px";
    return "400px";
  };

  return (
    <div className={`${jost.className} min-h-screen bg-black overflow-x-hidden`} style={{ color: 'var(--accent-strong)' }}>
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        :root {
          --font-jost: ${jost.style.fontFamily};
          --accent-rgb: 37,107,45;
          --accent: rgba(var(--accent-rgb), 1);
          --accent-strong: rgba(var(--accent-rgb), 0.95);
          --accent-medium: rgba(var(--accent-rgb), 0.85);
          --accent-soft: rgba(var(--accent-rgb), 0.15);
          --border-strong: rgba(var(--accent-rgb), 0.38);
          --border-soft: rgba(var(--accent-rgb), 0.15);
          --bg-banner: rgba(var(--accent-rgb), 0.12);
          --chart-area-alpha: 0.18;
        }

        html {
          font-family: var(--font-jost);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          background-color: #000000;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(37, 107, 45, 0.5);
          border-radius: 0;
          border: none;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(37, 107, 45, 0.8);
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 0;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thick;
          scrollbar-color: rgba(37, 107, 45, 0.5) #000000;
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto px-2 py-4 w-full">
        
        {isDesktop && (
          <div className="flex flex-col gap-4 w-full">
            <HeroContainer />
            
            <div className="flex gap-4 w-full">
              <BorderSection 
                title="projects" 
                className="w-2/3" 
                fixedHeight={true} 
                height={getProjectsSectionHeight()}
              >
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
          <div className="flex flex-col gap-4 w-full">
            <HeroContainer />
            <BorderSection 
              title="projects" 
              fixedHeight={true} 
              height={getProjectsSectionHeight()}
            >
              <ProjectsSection />
            </BorderSection>
            <BorderSection title="skills">
              <GraphsSection />
            </BorderSection>
            <BorderSection title="articles">
              <ArticlesSection />
            </BorderSection>
          </div>
        )}
        
        {isMobile && (
          <div className="flex flex-col gap-3 w-full">
            <HeroContainer />

            <BorderSection 
              title="projects" 
              fixedHeight={!isSmallPhone} 
              height={isSmallPhone ? "auto" : "350px"}
            >
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
        className="flex justify-end cursor-pointer mb-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.span 
          className="text-xs"
          whileHover={{ scale: 1.05 }}
          style={{ color: 'var(--accent-strong)' }}
        >
          {isOpen ? '▲' : '▼'} {!isOpen && <span className="text-xs" style={{ color: 'rgba(37,107,45,0.7)' }}>tap to expand</span>}
        </motion.span>
      </div>
      
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 32 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="overflow-hidden custom-scrollbar"
      >
        {isOpen ? children : (
            <div className="h-8 flex items-center justify-center">
            <span className="text-xs" style={{ color: 'rgba(37,107,45,0.5)' }}>Content collapsed</span>
            </div>
        )}
      </motion.div>
    </motion.div>
  );
}