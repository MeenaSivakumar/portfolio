import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [displayedName, setDisplayedName] = useState('');
  const [showRole, setShowRole] = useState(false);
  const fullName = 'Meena Sivakumar';
  const role = 'Mobile & Web Developer';

  useEffect(() => {
    // Type name letter by letter
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullName.length) {
        setDisplayedName(fullName.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // After name is complete, show role after a short delay
        setTimeout(() => {
          setShowRole(true);
        }, 500);
      }
    }, 100); // 100ms per letter

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Hi I am text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4"
      >
        Hi, I am
      </motion.p>

      {/* Name typing animation */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-gradient">
          {displayedName}
          {displayedName.length < fullName.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-12 md:h-16 bg-purple-500 ml-1"
            />
          )}
        </span>
      </motion.h1>

      {/* Role appears after name */}
      {showRole && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold text-purple-400"
        >
          {role}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Hero;
