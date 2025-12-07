import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiGithub, FiExternalLink, FiSmartphone, FiGlobe, FiCode } from 'react-icons/fi';
import { projects } from '@/utils/constants';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleTechnologies = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (category: string) => {
    return category === 'mobile' ? FiSmartphone : FiGlobe;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'mobile') return 'from-purple-500 to-pink-500';
    if (category === 'web') return 'from-purple-500 to-indigo-500';
    return 'from-purple-500 to-blue-500';
  };

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

      {/* Projects List - Full Width */}
      <div className="space-y-4">
        {projects.map((project, index) => {
          const CategoryIcon = getCategoryIcon(project.category);
          const gradientColor = getCategoryColor(project.category);

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-effect rounded-lg p-5 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
                    <CategoryIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {project.category === 'mobile' ? 'Mobile' : project.category === 'web' ? 'Web' : 'Fullstack'} App
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Technologies - GitHub Tags Style */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(expandedProjects.has(project.id) 
                  ? project.technologies 
                  : project.technologies.slice(0, 3)
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTechnologies(project.id);
                    }}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-purple-400 hover:bg-purple-500/20 rounded-md transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedProjects.has(project.id) 
                      ? `-${project.technologies.length - 3}` 
                      : `+${project.technologies.length - 3}`
                    }
                  </motion.button>
                )}
              </div>

              {/* Links - GitHub Style */}
              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <FiCode size={16} />
                  <span>Code</span>
                </div>
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
        })}
      </div>
    </motion.div>
  );
};

export default Projects;
