import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSmartphone, FiMail, FiUser, FiCode, FiBriefcase, FiLinkedin, FiGithub } from 'react-icons/fi';
import { projects } from '@/utils/constants';
import { socialLinks } from '@/utils/constants';

type AppView = 'home' | 'projects' | 'contact' | 'about' | null;
type ProjectView = string | null;

const MobileAppView = () => {
  const [currentApp, setCurrentApp] = useState<AppView>('home');
  const [selectedProject, setSelectedProject] = useState<ProjectView>(null);

  const apps = [
    { id: 'projects', name: 'Projects', icon: FiBriefcase, color: 'from-purple-500 to-pink-500' },
    { id: 'contact', name: 'Contact', icon: FiMail, color: 'from-purple-500 to-indigo-500' },
    { id: 'about', name: 'About', icon: FiUser, color: 'from-purple-500 to-blue-500' },
  ];

  const handleAppClick = (appId: string) => {
    setCurrentApp(appId as AppView);
    setSelectedProject(null);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentApp('home');
    }
  };

  return (
    <section id="mobile-view" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">My Work</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6" />
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Explore my projects and get in touch through the mobile interface
          </p>
        </div>

        <div className="flex justify-center">
          {/* Mobile Phone Frame */}
          <div className="relative w-full max-w-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-800"
            >
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
              
              {/* Screen */}
              <div className="relative bg-gray-950 rounded-[2.5rem] overflow-hidden min-h-[600px]">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-8 pb-2 text-xs text-gray-400">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-gray-400 rounded-sm">
                      <div className="w-3/4 h-full bg-gray-400 rounded-sm" />
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  </div>
                </div>

                {/* App Content */}
                <AnimatePresence mode="wait">
                  {currentApp === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 h-full"
                    >
                      {/* Home Screen - App Icons */}
                      <div className="text-center mb-8 mt-4">
                        <h2 className="text-2xl font-bold text-gradient mb-2">Meena Sivakumar</h2>
                        <p className="text-gray-400 text-sm">Mobile & Web Developer</p>
                      </div>

                      {/* App Grid */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {apps.map((app) => {
                          const Icon = app.icon;
                          return (
                            <motion.button
                              key={app.id}
                              onClick={() => handleAppClick(app.id)}
                              className="flex flex-col items-center gap-2"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                                <Icon size={28} className="text-white" />
                              </div>
                              <span className="text-xs text-gray-300">{app.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Projects as Apps */}
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2">My Work</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {projects.map((project) => (
                            <motion.button
                              key={project.id}
                              onClick={() => {
                                handleAppClick('projects');
                                handleProjectClick(project.id);
                              }}
                              className="glass-effect rounded-2xl p-4 text-left"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                                {project.category === 'mobile' ? (
                                  <FiSmartphone size={24} className="text-white" />
                                ) : (
                                  <FiCode size={24} className="text-white" />
                                )}
                              </div>
                              <h4 className="text-sm font-semibold text-gray-200 mb-1">{project.title}</h4>
                              <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentApp === 'projects' && !selectedProject && (
                    <motion.div
                      key="projects-list"
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-4 p-6 border-b border-white/10">
                        <motion.button
                          onClick={handleBack}
                          className="p-2 rounded-lg hover:bg-white/5"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiX size={20} className="text-gray-400" />
                        </motion.button>
                        <h2 className="text-xl font-bold text-gray-200">Projects</h2>
                      </div>

                      {/* Projects List */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {projects.map((project) => (
                          <motion.button
                            key={project.id}
                            onClick={() => handleProjectClick(project.id)}
                            className="w-full glass-effect rounded-xl p-4 text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                {project.category === 'mobile' ? (
                                  <FiSmartphone size={28} className="text-white" />
                                ) : (
                                  <FiCode size={28} className="text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-200 mb-1">{project.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.slice(0, 2).map((tech) => (
                                    <span key={tech} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentApp === 'projects' && selectedProject && (
                    <motion.div
                      key="project-detail"
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      {(() => {
                        const project = projects.find(p => p.id === selectedProject);
                        if (!project) return null;
                        return (
                          <>
                            {/* Header */}
                            <div className="flex items-center gap-4 p-6 border-b border-white/10">
                              <motion.button
                                onClick={handleBack}
                                className="p-2 rounded-lg hover:bg-white/5"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX size={20} className="text-gray-400" />
                              </motion.button>
                              <h2 className="text-xl font-bold text-gray-200">{project.title}</h2>
                            </div>

                            {/* Project Details */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                              <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                {project.category === 'mobile' ? (
                                  <FiSmartphone size={64} className="text-white/80" />
                                ) : (
                                  <FiCode size={64} className="text-white/80" />
                                )}
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4">
                                {project.githubUrl && (
                                  <motion.a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl text-center font-semibold"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    View Code
                                  </motion.a>
                                )}
                                {project.liveUrl && (
                                  <motion.a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-3 glass-effect text-purple-400 rounded-xl text-center font-semibold"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    Live Demo
                                  </motion.a>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}

                  {currentApp === 'contact' && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-4 p-6 border-b border-white/10">
                        <motion.button
                          onClick={handleBack}
                          className="p-2 rounded-lg hover:bg-white/5"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiX size={20} className="text-gray-400" />
                        </motion.button>
                        <h2 className="text-xl font-bold text-gray-200">Contact</h2>
                      </div>

                      {/* Contact App Content */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Profile Header */}
                        <div className="text-center py-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl font-bold text-white">MS</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-200 mb-1">Meena Sivakumar</h3>
                          <p className="text-gray-400 text-sm">Mobile & Web Developer</p>
                        </div>

                        {/* Contact Methods */}
                        <div className="space-y-3">
                          <motion.a
                            href={socialLinks.email}
                            className="flex items-center gap-4 p-4 glass-effect rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                              <FiMail size={24} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Email</p>
                              <p className="text-gray-200">meena@example.com</p>
                            </div>
                          </motion.a>

                          <motion.a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 glass-effect rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                              <FiLinkedin size={24} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">LinkedIn</p>
                              <p className="text-gray-200">linkedin.com/in/meena-sivakumar</p>
                            </div>
                          </motion.a>

                          <motion.a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 glass-effect rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                              <FiGithub size={24} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">GitHub</p>
                              <p className="text-gray-200">github.com/MeenaSivakumar</p>
                            </div>
                          </motion.a>
                        </div>

                        {/* Quick Message */}
                        <div className="pt-4">
                          <motion.a
                            href="mailto:meena@example.com"
                            className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center font-semibold"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Send Message
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentApp === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-4 p-6 border-b border-white/10">
                        <motion.button
                          onClick={handleBack}
                          className="p-2 rounded-lg hover:bg-white/5"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiX size={20} className="text-gray-400" />
                        </motion.button>
                        <h2 className="text-xl font-bold text-gray-200">About</h2>
                      </div>

                      {/* About Content */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="text-center py-4">
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl font-bold text-white">MS</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-200 mb-2">Meena Sivakumar</h3>
                          <p className="text-purple-400 font-medium">Mobile & Web App Developer</p>
                        </div>

                        <div className="space-y-4">
                          <p className="text-gray-400 text-sm leading-relaxed">
                            Passionate about crafting beautiful, performant mobile and web experiences.
                            I turn ideas into reality with clean code and modern technologies.
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            My journey in mobile and web development started with a simple curiosity
                            about how apps work. That curiosity evolved into a deep passion for creating
                            digital experiences that make a difference.
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            I specialize in React Native and Flutter for mobile development, and React
                            with TypeScript for web applications.
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="text-center p-4 glass-effect rounded-xl">
                            <div className="text-2xl font-bold text-purple-400 mb-1">100+</div>
                            <div className="text-xs text-gray-400">Projects</div>
                          </div>
                          <div className="text-center p-4 glass-effect rounded-xl">
                            <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
                            <div className="text-xs text-gray-400">Mobile Apps</div>
                          </div>
                          <div className="text-center p-4 glass-effect rounded-xl">
                            <div className="text-2xl font-bold text-purple-400 mb-1">30+</div>
                            <div className="text-xs text-gray-400">Web Apps</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppView;

