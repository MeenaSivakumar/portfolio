import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCode, FiSmartphone, FiGlobe, FiHeart } from 'react-icons/fi';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const passions = [
    {
      icon: FiSmartphone,
      title: 'Mobile Development',
      description: 'Creating native and cross-platform mobile experiences that users love. From iOS to Android, I bring ideas to life.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiGlobe,
      title: 'Web Development',
      description: 'Building responsive, performant web applications with modern frameworks and best practices.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: FiCode,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable code following SOLID principles and industry best practices.',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: FiHeart,
      title: 'Passion-Driven',
      description: 'Every project is an opportunity to learn, grow, and create something meaningful.',
      color: 'from-purple-500 to-rose-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="about"
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gradient">About Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6" />
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
              I'm a passionate developer who loves turning complex problems into simple,
              beautiful, and intuitive solutions.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-200 mb-4">
                Building the Future, One App at a Time
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                My journey in mobile and web development started with a simple curiosity
                about how apps work. That curiosity evolved into a deep passion for creating
                digital experiences that make a difference.
              </p>
              <p className="text-gray-400 leading-relaxed text-lg">
                I specialize in React Native and Flutter for mobile development, and React
                with TypeScript for web applications. I believe in writing clean, maintainable
                code that not only works but also tells a story.
              </p>
              <p className="text-gray-400 leading-relaxed text-lg">
                When I'm not coding, I'm exploring new technologies, contributing to open-source
                projects, or sharing knowledge with the developer community.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="glass-effect rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    💻
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-200">100+</div>
                    <div className="text-gray-400">Projects Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-200">50+</div>
                    <div className="text-gray-400">Mobile Apps</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    🌐
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-200">30+</div>
                    <div className="text-gray-400">Web Applications</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Passions Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {passions.map((passion) => {
              const Icon = passion.icon;
              return (
                <motion.div
                  key={passion.title}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-effect rounded-xl p-6 cursor-pointer framer-smooth group"
                >
                  <motion.div 
                    className={`w-14 h-14 bg-gradient-to-br ${passion.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3`}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-gray-200 mb-2">
                    {passion.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {passion.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

