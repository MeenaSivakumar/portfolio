import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiMail, FiSend, FiGithub, FiLinkedin, FiCode } from 'react-icons/fi';
import { socialLinks } from '@/utils/constants';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const socialIcons = [
    { icon: FiGithub, href: socialLinks.github, label: 'GitHub' },
    { icon: FiLinkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { icon: FiCode, href: socialLinks.leetcode, label: 'LeetCode' },
    { icon: FiMail, href: socialLinks.email, label: 'Email' },
  ];

  return (
    <section
      id="contact"
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
              <span className="text-gradient">Get In Touch</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6" />
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
              Have a project in mind? Let's collaborate and build something amazing together!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-200 mb-4">
                  Let's Connect
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision. Whether you have a question
                  or just want to say hi, feel free to reach out!
                </p>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-xl font-semibold text-gray-200 mb-4">
                  Find me on
                </h4>
                <div className="flex flex-wrap gap-4">
                  {socialIcons.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 glass-effect rounded-full flex items-center justify-center text-gray-400 hover:text-purple-400 transition-colors hover:purple-glow"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={label}
                    >
                      <Icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-purple-400 font-semibold">&lt; 24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Availability</span>
                  <span className="text-purple-400 font-semibold">Open to Work</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form
                onSubmit={handleSubmit}
                className="glass-effect rounded-2xl p-8 space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-300 font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-300 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-300 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 purple-glow flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSend size={20} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

