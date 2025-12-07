import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { skills } from '@/utils/constants';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories = ['mobile', 'web', 'tool'] as const;
  const categoryLabels = {
    mobile: 'Mobile Development',
    web: 'Web Development',
    tool: 'Tools & Technologies',
  };

  const categoryColors = {
    mobile: 'from-purple-500 to-pink-500',
    web: 'from-purple-500 to-indigo-500',
    tool: 'from-purple-500 to-blue-500',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gradient">Skills & Expertise</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6" />
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          {/* Skills by Category - New UI Design */}
          <div className="space-y-24">
            {categories.map((category) => {
              const categorySkills = skills.filter((skill) => skill.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Category Header with Icon */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-1 h-12 bg-gradient-to-b ${categoryColors[category]} rounded-full`} />
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-200 mb-1">
                        {categoryLabels[category]}
                      </h3>
                      <div className="h-0.5 w-20 bg-gradient-to-r from-purple-500 to-transparent" />
                    </div>
                  </div>

                  {/* Skills Grid - Tag Cloud Style */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        variants={itemVariants}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        whileHover={{ 
                          scale: 1.08, 
                          y: -4,
                          zIndex: 10,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`
                          relative group cursor-pointer
                          ${hoveredSkill === skill.name ? 'z-10' : ''}
                        `}
                        style={{
                          filter: hoveredSkill && hoveredSkill !== skill.name ? 'blur(2px)' : 'blur(0px)',
                          transition: 'filter 0.3s ease',
                        }}
                      >
                        {/* Skill Badge */}
                        <div className={`
                          glass-effect rounded-full px-6 py-3 
                          border border-white/10
                          hover:border-purple-500/50
                          transition-all duration-300
                          flex items-center gap-3
                          ${hoveredSkill === skill.name ? 'purple-glow scale-110' : ''}
                        `}>
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="text-base font-semibold text-gray-200 group-hover:text-purple-400 transition-colors">
                            {skill.name}
                          </span>
                        </div>

                        {/* Hover Tooltip */}
                        {hoveredSkill === skill.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className={`
                              absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                              glass-effect rounded-lg px-4 py-2
                              border border-purple-500/30
                              whitespace-nowrap z-20
                            `}
                          >
                            <div className="text-sm text-purple-400 font-medium">
                              {skill.category === 'mobile' && '📱 Mobile'}
                              {skill.category === 'web' && '🌐 Web'}
                              {skill.category === 'tool' && '🛠️ Tool'}
                            </div>
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500/30 border border-purple-500/50 rotate-45" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Floating Skills Showcase */}
          <motion.div
            variants={itemVariants}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-wrap gap-3 justify-center max-w-4xl">
              {skills.slice(0, 8).map((skill) => (
                <motion.div
                  key={skill.name}
                  className="glass-effect rounded-lg px-4 py-2 border border-white/5"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: Math.random() * 2,
                    },
                  }}
                >
                  <span className="text-sm text-gray-400">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

