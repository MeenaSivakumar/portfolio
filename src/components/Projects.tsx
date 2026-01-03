import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '@/utils/constants';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-effect rounded-xl p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-200">Projects</h2>
        <span className="text-sm text-gray-400">{projects.length} repositories</span>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
