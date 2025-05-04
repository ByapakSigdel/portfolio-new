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
  
  // Data arrays for icons
  const musicData = [
    "Nujabes - Spiritual State",
    "Porter Robinson - Nurture",
    "Kendrick Lamar - To Pimp a Butterfly",
    "Radiohead - OK Computer",
    "Yoko Kanno - Cowboy Bebop OST"
  ];

  const movieData = [
    "Blade Runner 2049",
    "Your Name",
    "Interstellar",
    "Spirited Away",
    "The Social Network"
  ];

  const imageData = [
    "Tokyo at night",
    "Mountain landscapes",
    "Cyberpunk aesthetics",
    "Minimal architecture",
    "Vintage film photography"
  ];

  const bookData = [
    "Kafka on the Shore - Haruki Murakami",
    "Snow Crash - Neal Stephenson",
    "The Three-Body Problem - Liu Cixin",
    "Dune - Frank Herbert",
    "Siddhartha - Hermann Hesse"
  ];

  const sparkData = [
    "Building a personal knowledge graph",
    "Learning Rust programming",
    "Exploring generative art",
    "Studying functional programming paradigms",
    "Building mechanical keyboards"
  ];
  
  const [quote, setQuote] = useState('');
  const [currentIconData, setCurrentIconData] = useState({ type: 'music', data: musicData[0] });
  
  // Border glow and hover effects from MainLayout
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
    
    // Cycle through different icon data every 5 seconds
    const iconTypes = ['music', 'movie', 'image', 'book', 'spark'];
    const iconDataSets = [musicData, movieData, imageData, bookData, sparkData];
    
    let currentIndex = 0;
    let dataIndex = 0;
    
    const intervalId = setInterval(() => {
      dataIndex = (dataIndex + 1) % iconDataSets[currentIndex].length;
      if (dataIndex === 0) {
        currentIndex = (currentIndex + 1) % iconTypes.length;
      }
      
      setCurrentIconData({
        type: iconTypes[currentIndex],
        data: iconDataSets[currentIndex][dataIndex]
      });
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Get the appropriate icon based on current type
  const getCurrentIcon = () => {
    switch (currentIconData.type) {
      case 'music': return <Music size={20} className="text-green-600" />;
      case 'movie': return <Film size={20} className="text-green-600" />;
      case 'image': return <Image size={20} className="text-green-600" />;
      case 'book': return <BookOpen size={20} className="text-green-600" />;
      case 'spark': return <Sparkles size={20} className="text-green-600" />;
      default: return <Music size={20} className="text-green-600" />;
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* ASCII Art Container */}
        <pre
          className="text-[#256B2D] font-mono whitespace-pre p-0 m-0 md:text-left text-center"
          style={{
            textShadow: '0 0 6px rgba(37, 107, 45, 0.4), 0 0 10px rgba(37, 107, 45, 0.3)',
            fontFamily: '"Courier New", monospace',
            fontSize: '3.5px',
            lineHeight: '4px',
            letterSpacing: '0px',
            display: 'block',
            overflow: 'visible'
          }}
          dangerouslySetInnerHTML={{ __html: asciiArt }}
        />

        {/* Content Container with Border */}
        <div className="ml-0 md:ml-8 w-full flex flex-col">
          {/* Name, Description, Quote Section */}
          <motion.div
            className="relative border border-solid p-4 mb-4 w-full"
            variants={sectionVariants}
            whileHover="hover"
            initial="initial"
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
            
            {/* Header Label */}
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black px-2">
              <span className="text-sm md:text-base text-[#256B2D] font-bold">about</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                mahan sigdel
              </h1>
              <p className="mt-3 text-xs md:text-sm text-green-600 w-full">
                Passionate developer crafting digital experiences with code and creativity.
                Transforming ideas into elegant, sustainable solutions.
              </p>
              
              {/* Quote */}
              <p className="mt-2 text-[10px] italic text-green-700 opacity-80 w-full md:text-left text-center">
                "{quote}"
              </p>
            </div>
          </motion.div>
          
          {/* Icons and Moving Banner Section */}
          <motion.div
            className="relative border border-solid p-3 w-full"
            variants={sectionVariants}
            whileHover="hover"
            initial="initial"
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
            
            {/* Header Label */}
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black px-2">
              <span className="text-sm md:text-base text-[#256B2D] font-bold">interests</span>
            </div>
            
            {/* Icons Section */}
            <div className="flex justify-center md:justify-start space-x-6 mb-3">
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Music size={20} className={currentIconData.type === 'music' ? 'text-green-500' : 'text-green-700 opacity-50'} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Film size={20} className={currentIconData.type === 'movie' ? 'text-green-500' : 'text-green-700 opacity-50'} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Image size={20} className={currentIconData.type === 'image' ? 'text-green-500' : 'text-green-700 opacity-50'} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <BookOpen size={20} className={currentIconData.type === 'book' ? 'text-green-500' : 'text-green-700 opacity-50'} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <Sparkles size={20} className={currentIconData.type === 'spark' ? 'text-green-500' : 'text-green-700 opacity-50'} />
              </motion.div>
            </div>
            
            {/* Moving Banner */}
            <div className="relative w-full overflow-hidden h-6 border-t border-green-900 border-opacity-30">
              <motion.div
                className="absolute whitespace-nowrap flex items-center h-full"
                variants={bannerVariants}
                animate="animate"
              >
                <div className="flex items-center">
                  {getCurrentIcon()}
                  <span className="ml-2 text-xs text-green-600">{currentIconData.data}</span>
                  <span className="mx-6 text-green-700 opacity-50">•</span>
                </div>
                
                {/* Duplicate content to create seamless loop */}
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center">
                    {getCurrentIcon()}
                    <span className="ml-2 text-xs text-green-600">{currentIconData.data}</span>
                    <span className="mx-6 text-green-700 opacity-50">•</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;