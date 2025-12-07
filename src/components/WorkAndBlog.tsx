import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FiBriefcase, FiCalendar, FiMapPin, FiBookOpen, FiClock, FiExternalLink } from 'react-icons/fi';
import { workExperience, blogPosts } from '@/utils/constants';

const WorkAndBlog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = timelineContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.scrollHeight;
      const viewportHeight = container.clientHeight;

      // Calculate scroll progress (0 to 1)
      const scrollableHeight = Math.max(containerHeight - viewportHeight, 1);
      const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight));
      setScrollProgress(progress);

      // Find which experience is currently most prominent in view
      let activeIdx = 0;
      let maxVisibility = -1;
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + viewportHeight;
      const targetPoint = scrollTop + viewportHeight * 0.3; // 30% down from top of viewport
      
      experienceRefs.current.forEach((expRef, idx) => {
        if (expRef) {
          // Get element position relative to container
          const elementOffsetTop = expRef.offsetTop;
          const elementHeight = expRef.offsetHeight;
          const elementTop = elementOffsetTop;
          const elementBottom = elementOffsetTop + elementHeight;
          const elementCenter = elementOffsetTop + elementHeight / 2;
          
          // Check if element intersects with viewport
          const isInViewport = elementBottom > viewportTop && elementTop < viewportBottom;
          
          if (isInViewport) {
            // Calculate how much of the element is visible
            const visibleTop = Math.max(elementTop, viewportTop);
            const visibleBottom = Math.min(elementBottom, viewportBottom);
            const visibleHeight = visibleBottom - visibleTop;
            const visibilityRatio = visibleHeight / elementHeight;
            
            // Prefer elements whose center or top is near the target point
            const distanceFromTarget = Math.abs(elementCenter - targetPoint);
            const score = visibilityRatio * 100 - distanceFromTarget * 0.1;
            
            if (score > maxVisibility) {
              maxVisibility = score;
              activeIdx = idx;
            }
          }
        }
      });

      setActiveIndex(activeIdx);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={ref} className="space-y-6">
      {/* Work Experience Section - LinkedIn Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiBriefcase size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold text-gray-200">Work Experience</h2>
        </div>
        <div 
          className="space-y-8 relative overflow-y-auto max-h-[600px] pr-4 custom-scrollbar pb-8" 
          ref={timelineContainerRef}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Background Timeline Line - Full Height */}
          <div className="absolute left-8 top-0 bottom-8 w-0.5 bg-purple-500/20" />
          
          {/* Animated Progress Timeline Line - Fills as you scroll */}
          <motion.div
            className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: scrollProgress } : { scaleY: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{ transformOrigin: 'top' }}
          />

          {workExperience.map((experience, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const phaseNumber = String(index + 1).padStart(2, '0');
            
            return (
              <motion.div
                key={experience.id}
                ref={(el) => {
                  experienceRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className={`relative flex gap-6 transition-all duration-500 ${
                  isActive ? 'scale-[1.01]' : ''
                }`}
              >
                {/* Timeline Number Circle - Zoho Style */}
                <div className="flex-shrink-0 relative z-10">
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 border-2 ${
                      isActive
                        ? 'bg-purple-500 text-white border-purple-400 scale-110 shadow-lg shadow-purple-500/50'
                        : isPast
                        ? 'bg-purple-500/80 text-white border-purple-400/60 scale-100'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30 scale-100'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { 
                      scale: isActive ? 1.1 : isPast ? 1 : 0.9, 
                      opacity: 1 
                    } : {}}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {phaseNumber}
                    {/* Pulsing ring - only for active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-purple-500 border-2 border-purple-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </motion.div>
                </div>
              
                {/* Content Section */}
                <div className={`flex-1 transition-all duration-500 ${
                  isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-50'
                }`}>
                  <div className="space-y-3">
                    {/* Title Section - Zoho Style */}
                    <div>
                      <h3 className={`text-xl font-bold transition-colors duration-300 mb-1 ${
                        isActive ? 'text-gray-100' : 'text-gray-200'
                      }`}>
                        {experience.position}
                      </h3>
                      <p className={`text-base font-semibold transition-colors duration-300 mb-2 ${
                        isActive ? 'text-purple-300' : 'text-purple-400'
                      }`}>
                        {experience.company}
                      </p>
                    </div>
                
                    {/* Date and Location - Zoho Style */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className={`flex items-center gap-1.5 transition-colors duration-300 ${
                        isActive ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        <FiCalendar size={14} />
                        <span className="font-medium">{experience.duration}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 transition-colors duration-300 ${
                        isActive ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        <FiMapPin size={14} />
                        <span className="font-medium">{experience.location}</span>
                      </div>
                    </div>

                    {/* Description List */}
                    <ul className="space-y-2 mt-4">
                      {experience.description.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ 
                            duration: 0.4, 
                            delay: 0.6 + index * 0.1 + idx * 0.05 
                          }}
                          className={`text-sm flex items-start gap-2 transition-colors duration-300 ${
                            isActive ? 'text-gray-300' : 'text-gray-400'
                          }`}
                        >
                          <span className={`mt-1.5 transition-colors duration-300 ${
                            isActive ? 'text-purple-400' : 'text-purple-500/50'
                          }`}>
                            •
                          </span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Technologies Tags */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex flex-wrap gap-2 mt-4"
                    >
                      {experience.technologies.map((tech, techIdx) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ 
                            delay: 0.8 + index * 0.1 + techIdx * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ scale: 1.1 }}
                          className={`px-3 py-1.5 text-xs rounded-md cursor-default transition-all duration-300 ${
                            isActive 
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                              : 'bg-purple-500/20 text-purple-400/70 border border-purple-500/20'
                          }`}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Blog Posts Section - Below Work Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiBookOpen size={24} className="text-purple-400" />
          <h2 className="text-xl font-bold text-gray-200">Blog Posts</h2>
        </div>
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="block p-4 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-purple-500/20 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-200 group-hover:text-purple-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar size={12} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center gap-1.5">
                        <FiClock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                <FiExternalLink 
                  size={20} 
                  className="text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" 
                />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkAndBlog;

