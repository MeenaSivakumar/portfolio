import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import { workExperience, blogPosts } from '@/utils/constants';
import { useTimelineScroll } from '@/hooks/useTimelineScroll';
import Timeline from './Timeline';
import BlogPosts from './BlogPosts';

const WorkAndBlog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const experienceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  const { activeIndex, scrollProgress } = useTimelineScroll({
    itemRefs: experienceRefs,
    containerRef: timelineContainerRef,
  });

  return (
    <div ref={ref} className="space-y-6">
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
        <Timeline
          experiences={workExperience}
          activeIndex={activeIndex}
          scrollProgress={scrollProgress}
          isInView={isInView}
          itemRefs={experienceRefs}
          containerRef={timelineContainerRef}
        />
      </motion.div>

      <BlogPosts posts={blogPosts} isInView={isInView} />
    </div>
  );
};

export default WorkAndBlog;

