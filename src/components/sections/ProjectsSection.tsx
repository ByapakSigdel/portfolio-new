'use client';
import React, { useState, useEffect } from 'react';

const ProjectsSection = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  const projects = [
    {
      title: "TTY Issue Debugger",
      description: "Advanced terminal troubleshooting toolkit",
      asciiArt: `
   _____________________
  |  _________________  |
  | |                 | |
  | |  $ sudo debug   | |
  | |  Scanning...    | |
  | |  TTY restored   | |
  | |_________________| |
  |_____________________|
      `
    },
    {
      title: "Boot Drive Creator",
      description: "Low-level USB boot media generator",
      asciiArt: `
       _______
      |       |
  ____|       |____
 |                |
 |  [=======]     |
 |________________|
      USB BOOT
      `
    },
    {
      title: "Network Protocol Scanner",
      description: "Security tool for protocol vulnerability assessment",
      asciiArt: `
       .-~~-.
      |     |
 .----' .--. '----.
 '----. '--' .----'
      |     |
       '-__-'
     SCANNING...
      `
    },
    {
      title: "File Encryption System",
      description: "Military-grade file security and encryption",
      asciiArt: `
   __________
  /          \\
 /  🔒        \\
|   SECRET     |
|   CONTENT    |
 \\            /
  \\__________/
      `
    }
  ];

  // Animation frames for transitions
  const animationFrames = [
    `
    .....
    .....
    .....
    `,
    `
    *....
    ..*..
    ...**
    `,
    `
    **...
    .***.
    .****
    `,
    `
    *****
    *****
    *****
    `
  ];

  // Handle navigation
  const goToNextProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationFrame(0);
    }
  };

  const goToPrevProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setAnimationFrame(0);
    }
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        if (animationFrame < animationFrames.length - 1) {
          setAnimationFrame(animationFrame + 1);
        } else {
          setIsAnimating(false);
          setCurrentProjectIndex((prevIndex) => 
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          );
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationFrame, projects.length]);

  return (
    <section className="section-container">
      <h2 className="section-header">PROJECTS</h2>
      
      <div className="projects-display">
        <div className="arrow-container left" onClick={goToPrevProject}>
          <div className="arrow-icon">◀</div>
        </div>
        
        <div className="project-content-wrapper">
          {isAnimating ? (
            <div className="ascii-animation">
              <pre>{animationFrames[animationFrame]}</pre>
            </div>
          ) : (
            <div className="project-item">
              <div className="ascii-container">
                <pre className="ascii-art">{projects[currentProjectIndex].asciiArt}</pre>
              </div>
              <div className="project-details">
                <h3 className="item-title">{projects[currentProjectIndex].title}</h3>
                <p className="item-description">{projects[currentProjectIndex].description}</p>
                <div className="project-indicator">
                  {currentProjectIndex + 1} / {projects.length}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="arrow-container right" onClick={goToNextProject}>
          <div className="arrow-icon">▶</div>
        </div>
      </div>
      
      <style jsx>{`
        .section-container {
          padding: 2rem;
          text-align: center;
        }
        
        .section-header {
          margin-bottom: 2rem;
          font-size: 2rem;
        }
        
        .projects-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2rem 0;
          position: relative;
        }
        
        .project-content-wrapper {
          flex-grow: 1;
          min-height: 250px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .project-item {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }
        
        .ascii-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 2rem;
        }
        
        .project-details {
          flex: 1;
          text-align: left;
          padding-left: 2rem;
          border-left: 1px solid #333;
        }
        
        .item-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .item-description {
          margin-bottom: 1.5rem;
          font-size: 1rem;
          color: #666;
        }
        
        .ascii-art {
          font-family: monospace;
          white-space: pre;
          line-height: 1.2;
        }
        
        .ascii-animation {
          font-family: monospace;
          white-space: pre;
          line-height: 1.2;
        }
        
        .arrow-container {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .arrow-container:hover {
          opacity: 1;
        }
        
        .arrow-icon {
          font-size: 1.5rem;
          color: #333;
        }
        
        .project-indicator {
          font-family: monospace;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;