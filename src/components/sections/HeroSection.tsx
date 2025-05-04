'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Film, Image, BookOpen, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const asciiArt = `
                                                 
                                                 ▓██████                                            
                                                █▓▒▓▓▓▓▓██                                          
                                              ██▒▒▓▓▓▓█████▓                                        
                                      ████████████████████████▓▓▓▓▓▓▓██                             
                             █████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█████▓▓▓▓▓▓▓▓██                             
                          ███▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█████▓▓█▓▓▓▓██                             
                       ███▓██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▒░░░░░░▓▓▓████████▓▓██                             
                     ██▒▓▓▓▓▓▓▓███▓▓▓▓▓▓▓▓▓▓▓▓▓▓░▒████▒░░▓▓▓▓█▓▓███████                             
                   ██▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░▒████▒░░▓▓▓▓███▓▓█████                             
                   ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████░░░▓▓▓▓▓██▓██████                             
                   ███▓▓▓▓▓██░░░░░░░▓▒█▓▒▓▒█████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████                         
                   ██▓▓▓░░▓██░░░░░░░███▒░░░▓▓▓████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████▓▓██                       
                   ██▓██▓▓▓██▓▓▓▓▓▓▓███▒░▓▓███▒░▓▓█▓▓█▓▓▓▓▓▓▓▓██▓▓▓██████▓▓██                       
                   ██▓█████████████████▓▓█████░░░▒█▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▓▓█████████                       
                     █████████████████████████░░▓▓███▓▓▓▓▓▓▓▓▓██▓▓▓▓█████████                       
                     ████████████████████████████████▓██▓▓▓▓▓▓▓▓▓▓▓▓█████████                       
                       ███████████████████████▓▓█▓▓███▓▓▓▓▓▓▓▓▓▓▓▓▓▓███████                         
                       ███████████████▓██████▓███▓▓██████▓▓▓▓▓▓▓▓▓▓▓█████                           
                       █████████▓▓▓███▓██▓▓▓▓▓███▓▓██▓██▓▓▓▓▓▓▓▓▓▓▓▓█████▓▓██                       
                       █████████▓▓▓███▓▓▓▓▓▒▒▒███▒▒▓▓▓███▓▓▓▓▓▓▓▓▓▓██████▓█▓▓█                      
                        ████████▒▒▒███▒▒▒▒▒▒▒▒███▒▒▒▒▓███▓▓▓▓▓██▓▓▓████████▓▓█                      
                        ████████▒▒▒███▒▒▒▒▒▒▒▒███▒▒▒▒▓███▓▓█▓▓▓▓▓▓▓████████▓▓█                      
                          ██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓█▓▓▓▓▓███████████████                       
                          ██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓█▓▓██▓▓▓█████████████                       
                          ██████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓███▓▓▓▓▓█████████████                         
                          ████████▒▒▒▒▒▒▓▓▓▓▓▒▒▒▒▒▒▓▓▓███▓▓████████████                             
                           █████████▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓████▓▓██▓████████                              
                           ███████████▓▓▓▓▓▓▓▓▓▓███▓▓████▓▓██████████                               
                             █████████████████▓▓▓▓▓▓▓███▓█▓████████                                 
                               ███████████████▓▓▓▓▓▓▓█▓▓█████████                                   
                               ████████████▓██▓▓▓▓▓██▓▓▓█████████████                               
                                ████████▓▒▓█▓▓▓▓▓▓█▓▓▓████████████████                              
                                ███████████▓▒▓▓▓██▓▓▓███████████▓▓▓▓██▓▓█                           
                               ████████▓█▓▓▓░░░▓██▓▓████▓▓▓▓▓█▓▓▓██▓▓▓███                           
                               ████▓▓█▓▓█▓▓▓▓▓▓▓██▓▓█▓████████▓▓▓▓█▓▓▓█████                         
                               ████▓▓█▓▓█▓▓▓░░░░▓█▓▓▓▓▓█████▓▓▓▓▓▓▓▓▓▓███████                     
                               ███████▓░█▓▓░░░░░▓█▓▓▓▓██▓█████▓▓▓▓▓▓▓▓▓▓█████▓▓█                    
                               ███████▓░█▓▓░░░░░▓█░▒▓▓████████▓▓█▓▓▓▓▓▓▓▓█████▓▓███▓                
                             █████████▓░█▓▓░░░░░▓█░▒▓▓████████▓▓▓▓▓▓▓▓▓▓▓███████▓▓███               
                             █████████▓░█▓▓░░░░░▓█░▒▓▓████████▓▓▓▓▓▓▓▓▓▓▓▓▓██████████               
                             █████████▓░█▓▓░░░░░▓█░▒█▓▓▓████████▓▓▓▓▓▓▓▓█▓▓█████████                
                           ███████████▓░█▓▓░░░░░▓█░▒█▓██████████▓▓▓▓▓▓▓▓▓▓▓███████                  
                           ██████████▓▓░█▓▓░░░░░▓█░▒█▓▓▓▓███████████▓▓▓▓▓▓▓█████                    
                          ███████████▓▓░█▓▓░░░░░▓█░▒█▓▓▓▓████████▓▓▓▓▓███▓██████                    
                        █████████████▓███▓▓░░░░░▓█░▒█▓▓▓▓▓▓████████████▓▓▓▓▓▓███                    
                        █████████████▓▓▓█▓▓░░░░░▓██▓▓▓▓██▓▓████████▓▓▓▓▓▓▓▓▓▓████                  
                        ████████▓▓███▓▓▓█▓▓░░░░░▓█▓▓▓▓████████▓▓█▓▓▓▓███▓▓▓▓▓████▓█                
                        ███████▒▓▓▓▓▓▓▓▓█▓▓░░░░▒▓█▓▓▓█▓▓▒▒▒██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓███████               
                        █████▓▓▓▓▓▓▓▓▓███▓▓░░░░▓██▓▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████████               
                        █████▓▓▓▓▓▓▓▓▓███▓▓░░░░▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████████
                           █████▓▓▓▓▓▓███▓▓▓░░▓▓███▓▓▓▓▓▓██▓▓███████████████████████ 
                             ██████▓▓▓███▓▓▓▓▓▓▓█████▓▓▓▓▓▓█████████████████████    
                               ██████████▓▓▓▓▓▓▓██████████████████████████████████   
  `;

  const quotes = [
    "No matter how deep the night, it always turns to day.",
    "Life is not a game of luck. If you wanna win, work hard.",
    "If you don't take risks, you can't create a future!",
    "The world is not beautiful, therefore it is.",
    "Sometimes the questions are complicated, and the answers are simple.",
    "You can't ever win if you're always on the defensive.",
    "The world isn't perfect. But it's there for us.",
    "I'm not a hero because I want your approval. I do it because I want to!",
    "Human strength lies in the ability to change yourself.",
    "The only ones who should kill are those prepared to be killed.",
    "Reject common sense to make the impossible possible.",
    "Power comes in response to a need, not a desire.",
    "If you don't share someone's pain, you can never understand them.",
    "It's not because I want to win, it's because I have to win.",
    "I do not fear death. I fear only that my rage will fade.",
    "We have to live a life of no regrets.",
    "People's lives don't end when they die, it ends when they lose faith.",
    "When you give up, that's when the game ends.",
    "I'll leave tomorrow's problems to tomorrow's me.",
    "It's okay not to be okay as long as you are not giving up.",
    "Fear is not evil. It tells you what your weakness is."
  ];
  
  // Riddles for the moving banner
  const riddles = [
    "... ..- -... ... -.-. .-. .. -... . / - --- / -.-. .... .. -.-- .- -....- .--. --- .--. / --. ..- ..-. ..-.",
  ];
  
  const [quote, setQuote] = useState('');
  const [currentRiddle, setCurrentRiddle] = useState('');
  
  // Modified section variants - only border color change, no scale
  const sectionVariants = {
    hover: {
      borderColor: 'rgba(37, 107, 45, 0.6)',
      transition: {
        duration: 0.3
      }
    },
    initial: {
      borderColor: 'rgba(174, 174, 174, 0.15)'
    }
  };

  // Banner animation
  const bannerVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  useEffect(() => {
    // Set random quote on load
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Set random riddle
    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    setCurrentRiddle(`${randomRiddle}`);
  }, [quotes, riddles]); // Added missing dependencies

  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* ASCII Art Container */}
        <pre
          className="text-[#256B2D] font-mono whitespace-pre p-0 m-0 md:text-left text-center"
          style={{
            textShadow: '0 0 6px rgba(37, 107, 45, 0.4), 0 0 10px rgba(37, 107, 45, 0.3)',
            fontFamily: '"Courier New", monospace',
            fontSize: '4px',
            lineHeight: '4.5px',
            letterSpacing: '0px',
            display: 'block',
            overflow: 'visible'
          }}
          dangerouslySetInnerHTML={{ __html: asciiArt }}
        />

        {/* Content Container */}
        <div className="ml-0 md:ml-8 w-full flex flex-col">
          {/* Name, Description, Quote Section - No top border and no right border */}
          <motion.div
            className="relative border-l border-b border-solid p-4 w-full"
            variants={sectionVariants}
            whileHover="hover"
            initial="initial"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-4xl md:text-3xl bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                mahan sigdel
              </h1>
              <p className="mt-3 text-xl md:text-base text-green-600 w-full">
                an engineer who loves tinkering with software or hardware.
              </p>
              <p className="mt-3 text-xl md:text-base text-green-600 w-full">
                contact me at my <a href="mailto:sigdelmb123@gmail.com" className="text-blue-800 hover:text-blue-800">mail</a> or my <a href="https://www.linkedin.com/in/mahansigdel" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-800">linkedin</a>.
              </p>
              
              {/* Quote - Fixed unescaped entities */}
              <p className="mt-3 text-xs md:text-xs italic text-green-700 opacity-80 w-full md:text-left text-center">
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          </motion.div>
          
          {/* Moving Banner - Green background with black text */}
          <div className="relative w-full overflow-hidden h-7 bg-green-700">
            <motion.div
              className="absolute whitespace-nowrap flex items-center h-full"
              variants={bannerVariants}
              animate="animate"
            >
              <div className="flex items-center">
                <span className="text-sm text-black font-mono">{currentRiddle}</span>
                <span className="mx-6 text-black opacity-70">•</span>
              </div>
              
              {/* Duplicate riddle to create seamless loop */}
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-sm text-black font-mono">{currentRiddle}</span>
                  <span className="mx-6 text-black opacity-70">•</span>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Icons Section - No bottom border and no right border */}
          <motion.div
            className="relative border-l border-t border-solid p-5 w-full"
            variants={sectionVariants}
            whileHover="hover"
            initial="initial"
          >
            {/* Icons Only */}
            <div className="flex justify-center md:justify-evenly space-x-10">
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Music size={20} className="text-green-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Film size={20} className="text-green-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Image size={20} className="text-green-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <BookOpen size={20} className="text-green-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Sparkles size={20} className="text-green-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;