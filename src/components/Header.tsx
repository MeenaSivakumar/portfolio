import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { name: 'Overview', href: '#overview' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const overviewElement = document.getElementById('overview');
      
      if (overviewElement) {
        const rect = overviewElement.getBoundingClientRect();
        if (rect.top <= 100) {
          setActiveSection('overview');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-effect backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg shadow-black/20'
          : 'backdrop-blur-sm bg-white/5 border-b border-white/5'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#overview"
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('overview')}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <span className="hidden sm:block text-lg font-semibold text-gray-200 group-hover:text-purple-400 transition-colors">
                Meena
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:border hover:border-white/10'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    type: "spring", 
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveSection(item.href.substring(1))}
                >
                  {item.name}
                </motion.a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-purple-400 glass-effect hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass-effect backdrop-blur-xl bg-white/5 border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-gray-300 transition-all duration-300 backdrop-blur-sm border ${
                      isActive
                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                        : 'hover:text-purple-400 hover:bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveSection(item.href.substring(1));
                    }}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;

