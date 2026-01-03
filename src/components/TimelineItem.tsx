import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { WorkExperience } from '@/types';

interface TimelineItemProps {
  experience: WorkExperience;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isInView: boolean;
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ experience, index, isActive, isPast, isInView }, ref) => {
    const phaseNumber = String(index + 1).padStart(2, '0');

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.3 + index * 0.1,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        className={`relative flex gap-6 transition-all duration-500 ${
          isActive ? 'scale-[1.01]' : ''
        }`}
      >
        {/* Timeline Number Circle */}
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
            animate={
              isInView
                ? {
                    scale: isActive ? 1.1 : isPast ? 1 : 0.9,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: 0.4 + index * 0.1,
              type: 'spring',
              stiffness: 200,
            }}
          >
            {phaseNumber}
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
        <div
          className={`flex-1 transition-all duration-500 ${
            isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-50'
          }`}
        >
          <div className="space-y-3">
            <div>
              <h3
                className={`text-xl font-bold transition-colors duration-300 mb-1 ${
                  isActive ? 'text-gray-100' : 'text-gray-200'
                }`}
              >
                {experience.position}
              </h3>
              <p
                className={`text-base font-semibold transition-colors duration-300 mb-2 ${
                  isActive ? 'text-purple-300' : 'text-purple-400'
                }`}
              >
                {experience.company}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div
                className={`flex items-center gap-1.5 transition-colors duration-300 ${
                  isActive ? 'text-gray-300' : 'text-gray-400'
                }`}
              >
                <FiCalendar size={14} />
                <span className="font-medium">{experience.duration}</span>
              </div>
              <div
                className={`flex items-center gap-1.5 transition-colors duration-300 ${
                  isActive ? 'text-gray-300' : 'text-gray-400'
                }`}
              >
                <FiMapPin size={14} />
                <span className="font-medium">{experience.location}</span>
              </div>
            </div>

            <ul className="space-y-2 mt-4">
              {experience.description.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.1 + idx * 0.05,
                  }}
                  className={`text-sm flex items-start gap-2 transition-colors duration-300 ${
                    isActive ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`mt-1.5 transition-colors duration-300 ${
                      isActive ? 'text-purple-400' : 'text-purple-500/50'
                    }`}
                  >
                    •
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

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
                    type: 'spring',
                    stiffness: 200,
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
  }
);

TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;

