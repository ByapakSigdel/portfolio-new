'use client';
import React, { useState } from 'react';

const ProjectsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const projects = [
    {
      title: "TTY Issue Debugger",
      description: "Advanced terminal troubleshooting toolkit",
      extendedDescription: "A comprehensive tool for diagnosing and fixing terminal connectivity issues across multiple OS platforms.",
      github: "https://github.com/yourusername/tty-debugger",
      web: "https://tty-debugger.example.com",
      asciiArt: `
 _____
|_   _|___ ___ 
  | | |_ -|_ -|
  |_| |___|___|
      `
    },
    {
      title: "Boot Drive Creator",
      description: "Low-level USB boot media generator",
      extendedDescription: "Create bootable USB drives with custom configurations for system recovery and OS installation.",
      github: "https://github.com/yourusername/boot-creator",
      web: "https://boot-creator.example.com",
      asciiArt: `
  ___ ___ ___ 
 | . | . | . |
 |_  |_  |___|
 |___|___|    
      `
    },
    {
      title: "Network Protocol Scanner",
      description: "Security tool for protocol vulnerability assessment",
      extendedDescription: "Detect network vulnerabilities by analyzing protocol implementation across your infrastructure.",
      github: "https://github.com/yourusername/protocol-scanner",
      web: "https://protocol-scanner.example.com",
      asciiArt: `
 ___ ___ ___ 
|   |  _|_ -|
| | |_| |___|
|___|___|    
      `
    },
    {
      title: "File Encryption System",
      description: "Military-grade file security and encryption",
      extendedDescription: "Secure your sensitive files with advanced encryption algorithms and key management.",
      github: "https://github.com/yourusername/encryption-system",
      web: "https://encryption-system.example.com",
      asciiArt: `
 ___ ___ ___ 
|  _|   |_ -|
|_| |_|_|___|
      `
    }
  ];

  const textColor = { color: '#256B2D' };
  const hoverTextColor = { color: '#1a4d20' }; // Slightly darker green for hover effect
  
  const handleLinkClick = (e) => {
    // Prevent the click from triggering the parent's onClick handler
    e.stopPropagation();
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {projects.map((project, index) => {
          // Determine if this card should be expanded based on click or hover
          const isExpanded = expandedIndex === index || (window.innerWidth >= 768 && hoverIndex === index);
          const isHovered = hoverIndex === index;
          
          return (
            <div
              key={index}
              className={`rounded-md border border-opacity-10 transition-all duration-300 ${
                isHovered ? 'border-green-700 shadow-md' : 'border-green-900'
              }`}
            >
              <div 
                className={`flex items-center justify-between p-3 group cursor-pointer transition-all duration-300 ${
                  isHovered ? 'bg-green-900 bg-opacity-15' : 'hover:bg-green-900 hover:bg-opacity-10'
                }`}
                onClick={() => toggleExpand(index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="flex items-center gap-4">
                  <div className="ascii-container hidden md:block">
                    <pre style={{
                      ...(isHovered ? hoverTextColor : textColor), 
                      fontSize: '0.6rem', 
                      lineHeight: '0.8rem'
                    }}>
                      {project.asciiArt}
                    </pre>
                  </div>
                  <div>
                    <h3 
                      className={`text-sm font-bold transition-all duration-300 ${
                        isHovered ? 'scale-105' : ''
                      }`} 
                      style={isHovered ? hoverTextColor : textColor}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-xs transition-all duration-300"
                      style={{ 
                        ...(isHovered ? hoverTextColor : textColor), 
                        opacity: isHovered ? 0.9 : 0.8 
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
                <div 
                  className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  style={isHovered ? hoverTextColor : textColor}
                >
                  ▼
                </div>
              </div>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'max-h-48 p-3 bg-green-900 bg-opacity-5' : 'max-h-0 p-0'
                } ${isHovered ? 'bg-green-900 bg-opacity-8' : 'bg-green-900 bg-opacity-5'}`}
                onMouseEnter={() => setHoverIndex(index)}
              >
                <p className="text-xs mb-3" style={{...textColor, opacity: 0.9}}>
                  {project.extendedDescription}
                </p>
                <div className="flex gap-4">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs hover:underline hover:font-medium"
                    style={textColor}
                    onClick={handleLinkClick}
                  >
                    <span>GitHub</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href={project.web} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs hover:underline hover:font-medium"
                    style={textColor}
                    onClick={handleLinkClick}
                  >
                    <span>Website</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-1 text-xs hover:underline hover:font-medium"
                    style={textColor}
                    onClick={handleLinkClick}
                  >
                    <span>Demo</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;