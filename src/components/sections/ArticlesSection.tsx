'use client';
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';

const ArticlesSection: React.FC = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const articles = [
    {
      title: "Troubleshooting TTY1 issue and Creating a Bootable Drive",
      description: "Deep dive into terminal interface debugging techniques",
      link: "https://blog.mahansigdel.com.np/troubleshooting-tty1-issue-and-creating-a-bootable-drive",
      asciiArt: `
░▀▀█░▀█▀
░░▒█░░█░
░▀▀▀░▀▀▀
      `
    },
    {
      title: "Remote Access for Linux from your Android/iOS",
      description: "Step-by-step guide to reliable remote access setup",
      link: "https://blog.mahansigdel.com.np/remote-access-for-linux",
      asciiArt: `
░▒█▀░▒█▀
░░▀▄░▀▄░
░▀▀░░▀▀░
      `
    },
    {
      title: "Just me, Python and a Discord bot that wouldn't listen",
      description: "A personal story and debugging journey building a Discord bot with Python",
      link: "https://blog.mahansigdel.com.np/just-me-python-and-a-discord-bot-that-wouldnt-listen",
      asciiArt: `
 ░█▀█░█▀█░
 ░█░█░█░█░
 ░▀░▀░▀▀▀░
      `
    },
  ];

  const textColor = { color: '#256B2D' };
  const hoverTextColor = { color: '#1a4d20' }; // Slightly darker green for hover effect

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {articles.map((article, index) => {
          const isHovered = hoverIndex === index;
          
          return (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${isHovered ? 'shadow-md' : ''}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: isHovered ? 'rgba(37,107,45,0.7)' : 'rgba(37,107,45,0.15)',
                backgroundColor: isHovered ? 'rgba(37,107,45,0.15)' : undefined
              }}
            >
              <div className="flex items-center gap-3">
                <div className="ascii-container hidden md:block">
                  <pre style={{
                    ...(isHovered ? hoverTextColor : textColor),
                    fontSize: '0.5rem',
                    lineHeight: '0.7rem'
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
                    className={`hidden md:block overflow-hidden transition-all duration-300 ${
                      isHovered ? 'max-h-16 opacity-100 mt-1' : 'max-h-0 opacity-0'
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
              <FaArrowRight
                className={`transform transition-all duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`}
                style={isHovered ? hoverTextColor : textColor}
                size={14}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ArticlesSection;