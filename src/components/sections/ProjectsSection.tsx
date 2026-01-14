'use client';
import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import { IoChevronDown } from 'react-icons/io5';

const ProjectsSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const toggleExpand = (index: number): void => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const projects = [
    {
      title: "Virtual Mouse",
      description: "Control your computer mouse using hand gestures via OpenCV and MediaPipe.",
      extendedDescription: "A Python-based application utilizing OpenCV and MediaPipe to track hand movements, translating them into mouse controls for hands-free computer interaction.",
      github: "https://github.com/ByapakSigdel/Virtual-Mouse",
      asciiArt: `
░█▒█░█▄▒▄█
░▀▄▀░█▒▀▒█
      `
    },
    {
      title: "E-commerce Website Builder",
      description: "A platform to easily build and deploy custom e-commerce websites.",
      extendedDescription: "Developed during my internship, this platform allows users to create fully functional e-commerce websites without coding, featuring product management, payment integration, and customizable templates. Hosted at shopatbanau.com.",
      github: "",
      web: "https://shopatbanau.com",
      asciiArt: `
▒██▀░▄▀▀
░█▄▄░▀▄▄
      `
    },
    {
      title: "NexOS",
      description: "A lightweight, Linux-based custom operating system for optimized performance.",
      extendedDescription: "NexOS is a custom-built Linux-based operating system focusing on optimized communication and efficient memory management, developed during our minor project.",
      asciiArt: `
░█▄░█░▀▄▀
░█▒▀█░█▒█
      `
    },
    {
      title: "WEB3 Blog Dapp",
      description: "A decentralized blogging application built on the Solana blockchain.",
      extendedDescription: "A decentralized application (DApp) enabling users to publish and read blogs stored on the Solana blockchain, using React.js for the frontend and integrating wallet authentication and smart contracts.",
      github: "https://github.com/ByapakSigdel/Web3-Dapp",
      
      asciiArt: `
░█░░▒█░▀██
░▀▄▀▄▀░▄▄█
      `
    },
    {
      title: "Automatic PetFeeder",
      description: "An IoT device to automate pet feeding schedules with remote control.",
      extendedDescription: "An Arduino-based IoT project allowing pet owners to schedule feeding times, monitor feeding via sensors, and control dispensing remotely through a connected app, ensuring pets are fed on time even when away.",
      github: "https://github.com/ByapakSigdel/Pet-feeder",
      
      asciiArt: `
▒█▀▄▒█▀
░█▀▒░█▀
      `
    }
  ];
  
  const textColor = { color: '#256B2D' };
  const hoverTextColor = { color: '#1a4d20' }; // Slightly darker green for hover effect
  
  const handleLinkClick = (e: React.MouseEvent): void => {
    // Prevent the click from triggering the parent's onClick handler
    e.stopPropagation();
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {projects.map((project, index) => {
          // Check if window is defined (client-side) before accessing it
          const isClient = typeof window !== 'undefined';
          // Determine if this card should be expanded based on click or hover
          const isExpanded = expandedIndex === index || (isClient && window.innerWidth >= 768 && hoverIndex === index);
          const isHovered = hoverIndex === index;
          
          return (
            <div
              key={index}
              className={`rounded-md transition-all duration-300 ${isHovered ? 'shadow-md' : ''}`}
              style={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: isHovered ? 'rgba(37,107,45,0.7)' : 'rgba(37,107,45,0.15)'
              }}
            >
              <div 
                className={`flex items-center justify-between p-3 group cursor-pointer transition-all duration-300`}
                style={{
                  backgroundColor: isHovered ? 'rgba(37,107,45,0.15)' : undefined
                }}
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
                <IoChevronDown 
                  className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  style={isHovered ? hoverTextColor : textColor}
                  size={16}
                />
              </div>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-48 p-3' : 'max-h-0 p-0'}`}
                onMouseEnter={() => setHoverIndex(index)}
                style={{
                  backgroundColor: isExpanded
                    ? 'rgba(37,107,45,0.05)'
                    : isHovered
                    ? 'rgba(37,107,45,0.08)'
                    : 'rgba(37,107,45,0.05)'
                }}
              >
                <p className="text-xs mb-3" style={{...textColor, opacity: 0.9}}>
                  {project.extendedDescription}
                </p>
                <div className="flex gap-4">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline hover:font-medium"
                      style={textColor}
                      onClick={handleLinkClick}
                    >
                      <FaGithub size={16} />
                    </a>
                  )}
                  {project.web && (
                    <a 
                      href={project.web} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline hover:font-medium"
                      style={textColor}
                      onClick={handleLinkClick}
                    >
                      <TbWorld size={16} />
                    </a>
                  )}
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