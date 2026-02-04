import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiBriefcase, FiStar, FiCode, FiDownload, FiMessageCircle } from 'react-icons/fi';
import { socialLinks, projects } from '@/utils/constants';
import ContactFormModal from './ContactFormModal';

const ProfileSidebar = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Generate floating particles with fixed values to prevent re-renders
  const particles = [
    { id: 0, size: 4, x: 15, y: 20, duration: 12, delay: 1 },
    { id: 1, size: 3, x: 75, y: 35, duration: 14, delay: 2 },
    { id: 2, size: 5, x: 45, y: 60, duration: 10, delay: 0 },
    { id: 3, size: 2, x: 85, y: 80, duration: 16, delay: 3 },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 30, 0],
              x: [0, 20, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 0.8, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-6 sticky top-24 relative z-10"
      >
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">MS</span>
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-1">Meena Sivakumar</h3>
          <p className="text-sm text-gray-400 mb-4">Mobile & Web Developer</p>
          
          {/* Location & Role */}
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <FiMapPin size={14} />
              <span>Available for work</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiBriefcase size={14} />
              <span>Full-time Developer</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{projects.length}</div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {projects.filter(p => p.category === 'mobile').length}
            </div>
            <div className="text-xs text-gray-400">Mobile</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {projects.filter(p => p.category === 'web' || p.category === 'fullstack').length}
            </div>
            <div className="text-xs text-gray-400">Web</div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <motion.a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-purple-400"
            whileHover={{ x: 4 }}
          >
            <FiGithub size={20} />
            <span className="text-sm">GitHub</span>
          </motion.a>
          <motion.a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-purple-400"
            whileHover={{ x: 4 }}
          >
            <FiLinkedin size={20} />
            <span className="text-sm">LinkedIn</span>
          </motion.a>
          <motion.a
            href={socialLinks.email}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-purple-400"
            whileHover={{ x: 4 }}
          >
            <FiMail size={20} />
            <span className="text-sm">Email</span>
          </motion.a>
          <motion.a
            href={socialLinks.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-purple-400"
            whileHover={{ x: 4 }}
          >
            <FiCode size={20} />
            <span className="text-sm">LeetCode</span>
          </motion.a>
        </div>

        {/* Action Buttons - Visible on mobile/tablet */}
        <div className="space-y-3 pt-4 border-t border-white/10 xl:hidden">
          <motion.a
            href="/resume.pdf"
            download="Meena_Sivakumar_Resume.pdf"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg font-medium transition-all border border-white/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiDownload size={18} />
            <span>Download Resume</span>
          </motion.a>
          <motion.button
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMessageCircle size={18} />
            <span>Send Message</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Stars - Fixed positions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: 10, top: 15, delay: 0, duration: 4 },
          { left: 80, top: 40, delay: 1, duration: 3.5 },
          { left: 30, top: 70, delay: 0.5, duration: 4.5 },
        ].map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-purple-400/20"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          >
            <FiStar size={16} />
          </motion.div>
        ))}
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </aside>
  );
};

export default ProfileSidebar;

