'use client';
import React, { useState } from 'react';

const ArticlesSection = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const articles = [
    {
      title: "Troubleshooting TTY Issues",
      description: "Deep dive into terminal interface debugging techniques",
      asciiArt: `
 _____
|_   _|___ ___ 
  | | |_ -|_ -|
  |_| |___|___|
      `
    },
    {
      title: "Creating Bootable Media",
      description: "Step-by-step guide to reliable boot drive creation",
      asciiArt: `
  ___ ___ ___ 
 | . | . | . |
 |_  |_  |___|
 |___|___|    
      `
    },
    {
      title: "Network Security Protocols",
      description: "Understanding modern encryption standards",
      asciiArt: `
 ___ ___ ___ 
|   |  _|_ -|
| | |_| |___|
|___|___|    
      `
    },
    {
      title: "File System Architecture",
      description: "Low-level exploration of storage systems",
      asciiArt: `
 ___ ___ ___ 
|  _|   |_ -|
|_| |_|_|___|
      `
    }
  ];

  const textColor = { color: '#256B2D' };
  const hoverTextColor = { color: '#1a4d20' }; // Slightly darker green for hover effect

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {articles.map((article, index) => {
          const isHovered = hoverIndex === index;
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-md border border-opacity-10 transition-all duration-300 ${
                isHovered ? 'border-green-700 shadow-md bg-green-900 bg-opacity-15' : 'border-green-900 hover:bg-green-900 hover:bg-opacity-10'
              }`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="ascii-container hidden md:block"
                >
                  <pre style={{
                    ...(isHovered ? hoverTextColor : textColor), 
                    fontSize: '0.6rem', 
                    lineHeight: '0.8rem'
                  }}>
                    {article.asciiArt}
                  </pre>
                </div>
                <div>
                  <h3 
                    className={`text-sm font-bold transition-all duration-300 ${
                      isHovered ? 'scale-105' : ''
                    }`}
                    style={isHovered ? hoverTextColor : textColor}
                  >
                    {article.title}
                  </h3>
                  
                  {/* Description - shown on hover for desktop, always hidden on mobile */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      window.innerWidth >= 768 && isHovered ? 'max-h-16 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p
                      className="text-xs"
                      style={{ ...(isHovered ? hoverTextColor : textColor), opacity: 0.9 }}
                    >
                      {article.description}
                    </p>
                  </div>
                  
                  {/* Always visible description on mobile - hidden on desktop */}
                  <p
                    className="text-xs block md:hidden"
                    style={{ ...textColor, opacity: 0.8 }}
                  >
                    {article.description}
                  </p>
                </div>
              </div>
              <span 
                className={`transform transition-all duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`}
                style={isHovered ? hoverTextColor : textColor}
              >
                ➚
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ArticlesSection;