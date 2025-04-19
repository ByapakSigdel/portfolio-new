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
    <section className="w-full">
      <div className="flex justify-between items-center w-full">
        <div className="arrow-container left" onClick={goToPrevProject}>
          <div className="arrow-icon">◀</div>
        </div>
        
        <div className="project-content-wrapper flex-1">
          {isAnimating ? (
            <div className="ascii-animation text-center">
              <pre>{animationFrames[animationFrame]}</pre>
            </div>
          ) : (
            <div className="project-item flex flex-col md:flex-row">
              <div className="ascii-container md:w-1/2">
                <pre className="ascii-art text-green-400 text-xs">{projects[currentProjectIndex].asciiArt}</pre>
              </div>
              <div className="project-details md:w-1/2 text-left md:pl-4 mt-4 md:mt-0">
                <h3 className="text-lg font-bold text-green-400">{projects[currentProjectIndex].title}</h3>
                <p className="text-sm text-green-400 opacity-80 mb-4">{projects[currentProjectIndex].description}</p>
                <div className="text-xs text-green-400 opacity-60">
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
    </section>
  );
};

export default ProjectsSection;