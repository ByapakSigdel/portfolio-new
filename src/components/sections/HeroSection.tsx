'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Film, Image as ImageIcon, BookOpen, Heart } from 'lucide-react';

// Move arrays outside component to prevent recreation on each render
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
  "... ..- -... ... -.-. .-. .. -... . / - --- / -.-. .... .. -.-- .- -....- .--. --- .--. / --. ..- ..-. ..-",
];

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
                        ████████▒▒▒███▒▒▒▒▒▒▒▒███▒▒▒▒▓███▓▓█▓▓▓▓▓████████▓▓█                      
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
                             █████████▓░█▓▓░░░░░▓█░▒▓▓████████▓▓▓▓▓▓▓▓▓▓▓▓██████████               
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
                               ██████████▓▓▓▓▓▓▓██████████████████████████████████   `;

  // Initialize with empty values to prevent hydration mismatch
  const [quote, setQuote] = useState('');
  const [currentRiddle, setCurrentRiddle] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string | null>>({});
  
  // Modified section variants - only border color change, no scale
  const sectionVariants = {
    hover: {
      borderColor: 'rgba(0, 230, 57, 0.6)',
      transition: {
        duration: 0.3
      }
    },
    initial: {
      borderColor: 'rgba(0, 230, 57, 0.15)'
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
    // Set client flag to true after mounting
    setIsClient(true);
    
    // Set random quote on client load only
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Set random riddle
    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    setCurrentRiddle(randomRiddle);

    // Fetch recommendations safely
    const fetchSuggestions = async () => {
        const categoryMap: Record<string, string> = {
          'music': 'song',
          'movie': 'movie',
          'image': 'image',
          'book': 'book',
          'misc': 'misc'
        };
        const kinds = Object.keys(categoryMap);
        const out: Record<string, string | null> = {};
        
        await Promise.all(kinds.map(async (k) => {
          try {
            const dbColumn = categoryMap[k];
            const res = await fetch(`/api/recommendation?kind=${encodeURIComponent(dbColumn)}`);
            if (res.ok) {
              const json = await res.json();
              out[k] = json.link || null;
            } else {
              out[k] = null;
            }
          } catch {
            out[k] = null;
          }
        }));
        setSuggestions(out);
    };

    fetchSuggestions();
  }, []);

  const handleClick = (kind: string) => {
    const link = suggestions[kind];
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="relative w-full">
      {/* Main container - much more compact */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row min-h-[300px]">
          {/* ASCII Art Container - smaller */}
          <div className="flex-shrink-0 hidden md:flex items-center justify-center border-r border-[var(--border-soft)] p-4 bg-gradient-to-br from-transparent to-[rgba(0,230,57,0.02)] w-[300px]">
            <pre
              className="text-[#00E639] font-mono whitespace-pre select-none"
              style={{
                fontFamily: '"Cascadia Code", "Fira Code", "Consolas", "Courier New", monospace',
                fontSize: '5px',
                lineHeight: '5px',
                letterSpacing: '-0.1px',
                textRendering: 'geometricPrecision',
                fontWeight: '600',
                textShadow: '0 0 6px rgba(0, 230, 57, 0.3)',
                filter: 'contrast(1.4) brightness(1.15)',
                margin: 0,
                padding: 0,
                maxWidth: 'fit-content',
                imageRendering: 'pixelated',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              {asciiArt}
            </pre>
          </div>

          {/* Mobile ASCII Art */}
          <div className="flex-shrink-0 flex md:hidden items-center justify-center border-b border-[var(--border-soft)] overflow-hidden" style={{ height: '160px' }}>
            <pre
              className="text-[#00E639] font-mono whitespace-pre select-none"
              style={{
                fontFamily: '"Cascadia Code", "Fira Code", "Consolas", "Courier New", monospace',
                fontSize: '5px',
                lineHeight: '5px',
                letterSpacing: '-0.1px',
                textRendering: 'geometricPrecision',
                fontWeight: '600',
                filter: 'contrast(1.4) brightness(1.15)',
                margin: 0,
                padding: 0,
                maxWidth: 'fit-content',
                imageRendering: 'pixelated',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                transformOrigin: 'center center',
                transform: 'scale(0.55)',
              }}
            >
              {asciiArt}
            </pre>
          </div>

          {/* Right side content - much more compact */}
          <div className="flex-1 flex flex-col">
            {/* Name, Description, Quote Section - reduced padding */}
            <motion.div
              className="border-b border-[var(--border-soft)] p-4 flex-1 min-h-[180px] flex items-center"
              variants={sectionVariants}
              whileHover="hover"
              initial="initial"
            >
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00E639] to-[#33EB61] bg-clip-text text-transparent mb-3">
                  mahan sigdel
                </h1>
                <p className="text-sm lg:text-base text-[#00E639] mb-2 leading-relaxed">
                  an engineer who loves tinkering with software and hardware.
                </p>
                <p className="text-sm lg:text-base text-[#00E639] mb-3 leading-relaxed">
                  contact me at my{' '}
                  <a 
                    href="mailto:sigdelmb123@gmail.com" 
                    className="text-[#33EB61] hover:text-white underline decoration-2 underline-offset-2 transition-colors"
                  >
                    mail
                  </a>
                  {' '}or my{' '}
                  <a 
                    href="https://www.linkedin.com/in/mahansigdel" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#33EB61] hover:text-white underline decoration-2 underline-offset-2 transition-colors"
                  >
                    linkedin
                  </a>
                  .
                </p>
                
                {/* Quote - smaller text */}
                {isClient && quote && (
                  <p className="text-xs lg:text-sm italic text-[#00E639] opacity-80 leading-relaxed max-w-lg">
                    &ldquo;{quote}&rdquo;
                  </p>
                )}
                
                {/* Fallback quote for SSR */}
                {!isClient && (
                  <p className="text-xs lg:text-sm italic text-[#00E639] opacity-80 leading-relaxed max-w-lg">
                    &ldquo;No matter how deep the night, it always turns to day.&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
            
            {/* Moving Banner - smaller height */}
            <div className="relative w-full overflow-hidden h-8 bg-transparent border-b border-[var(--border-soft)]">
              {isClient && currentRiddle && (
                <motion.div
                  className="absolute whitespace-nowrap flex items-center h-full"
                  variants={bannerVariants}
                  animate="animate"
                >
                  <div className="flex items-center">
                    <span className="text-xs text-[#00E639] font-mono tracking-wider px-3">{currentRiddle}</span>
                    <span className="mx-6 text-[#00E639] opacity-70">•</span>
                  </div>
                  
                  {/* Duplicate riddle to create seamless loop */}
                  {Array(10).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <span className="text-xs text-[#00E639] font-mono tracking-wider px-3">{currentRiddle}</span>
                      <span className="mx-6 text-[#00E639] opacity-70">•</span>
                    </div>
                  ))}
                </motion.div>
              )}
              
              {/* Fallback banner for SSR */}
              {!isClient && (
                <div className="absolute whitespace-nowrap flex items-center h-full">
                  <div className="flex items-center">
                    <span className="text-xs text-[#00E639] font-mono tracking-wider px-3">
                      ... ..- -... ... -.-. .-. .. -... . / - --- / -.-. .... .. -.-- .- -....- .--. --- .--. / --. ..- ..-. ..-
                    </span>
                    <span className="mx-6 text-[#00E639] opacity-70">•</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Icons Section - more compact */}
            <motion.div
              className="p-4 min-h-[80px] flex flex-col justify-center"
              variants={sectionVariants}
              whileHover="hover"
              initial="initial"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] mb-3 text-center lg:text-left" style={{ color: 'rgba(0,230,57,0.5)' }}>recommendations</span>
              <div className="flex justify-between items-center w-full">
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2 }} 
                   className="cursor-pointer transition-all duration-200 hover:text-[#33EB61] p-1"
                  onClick={() => handleClick('music')}
                  title="song rec"
                >
                  <Music size={20} className="text-[#00E639]" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2 }} 
                  className="cursor-pointer transition-all duration-200 hover:text-[#33EB61] p-1"
                  onClick={() => handleClick('movie')}
                  title="movie rec"
                >
                  <Film size={20} className="text-[#00E639]" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2 }} 
                  className="cursor-pointer transition-all duration-200 hover:text-[#33EB61] p-1"
                  onClick={() => handleClick('image')}
                  title="image rec"
                >
                  <ImageIcon size={20} className="text-[#00E639]" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2 }} 
                  className="cursor-pointer transition-all duration-200 hover:text-[#33EB61] p-1"
                   onClick={() => handleClick('book')}
                  title="book rec"
                >
                  <BookOpen size={20} className="text-[#00E639]" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -2 }} 
                  className="cursor-pointer transition-all duration-200 hover:text-[#33EB61] p-1"
                  onClick={() => handleClick('misc')}
                  title="misc rec"
                >
                  <Heart size={20} className="text-[#00E639]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
