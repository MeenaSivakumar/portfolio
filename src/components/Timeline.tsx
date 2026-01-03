import { motion } from 'framer-motion';
import { RefObject, MutableRefObject } from 'react';
import { WorkExperience } from '@/types';
import TimelineItem from './TimelineItem';

interface TimelineProps {
  experiences: WorkExperience[];
  activeIndex: number;
  scrollProgress: number;
  isInView: boolean;
  itemRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  containerRef: RefObject<HTMLDivElement>;
}

const Timeline = ({
  experiences,
  activeIndex,
  scrollProgress,
  isInView,
  itemRefs,
  containerRef,
}: TimelineProps) => {
  return (
    <div
      className="relative overflow-y-auto max-h-[600px] pl-4 pr-4 custom-scrollbar"
      ref={containerRef}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="space-y-8 pb-4 relative">
        {/* Background Timeline Line */}
        <div
          className="absolute left-8 top-0 w-0.5 bg-purple-500/20"
          style={{ height: 'calc(100% - 2rem)' }}
        />

        {/* Animated Progress Timeline Line */}
        <motion.div
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: scrollProgress } : { scaleY: 0 }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{
            transformOrigin: 'top',
            height: 'calc(100% - 2rem)',
          }}
        />

        {experiences.map((experience, index) => (
          <TimelineItem
            key={experience.id}
            experience={experience}
            index={index}
            isActive={index === activeIndex}
            isPast={index < activeIndex}
            isInView={isInView}
            ref={(el) => {
              if (itemRefs.current) {
                itemRefs.current[index] = el;
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;

