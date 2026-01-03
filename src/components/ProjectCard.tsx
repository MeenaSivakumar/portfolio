import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiGithub, FiExternalLink, FiSmartphone, FiGlobe } from 'react-icons/fi';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  isInView: boolean;
}

const ProjectCard = ({ project, index, isInView }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CategoryIcon = project.category === 'mobile' ? FiSmartphone : FiGlobe;
  const gradientColor =
    project.category === 'mobile'
      ? 'from-purple-500 to-pink-500'
      : project.category === 'web'
      ? 'from-purple-500 to-indigo-500'
      : 'from-purple-500 to-blue-500';

  const displayedTechs = isExpanded
    ? project.technologies
    : project.technologies.slice(0, 3);
  const remainingCount = project.technologies.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-effect rounded-lg p-5 hover:border-purple-500/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
          >
            <CategoryIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
              {project.title}
            </h3>
            <span className="text-xs text-gray-500">
              {project.category === 'mobile'
                ? 'Mobile'
                : project.category === 'web'
                ? 'Web'
                : 'Fullstack'}{' '}
              App
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {displayedTechs.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md"
          >
            {tech}
          </span>
        ))}
        {remainingCount > 0 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="px-2 py-1 text-xs text-gray-500 hover:text-purple-400 hover:bg-purple-500/20 rounded-md transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? `-${remainingCount}` : `+${remainingCount}`}
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-white/10">
        {project.githubUrl && (
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-400 transition-colors"
            whileHover={{ x: 2 }}
          >
            <FiGithub size={16} />
            <span>GitHub</span>
          </motion.a>
        )}
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-400 transition-colors"
            whileHover={{ x: 2 }}
          >
            <FiExternalLink size={16} />
            <span>Live</span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;

