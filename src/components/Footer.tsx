import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiCode } from 'react-icons/fi';
import { socialLinks } from '@/utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm"
          >
            © {currentYear} Copyright Reserved.
          </motion.p>

          <div className="flex items-center gap-6">
            {[
              { icon: FiGithub, href: socialLinks.github, label: 'GitHub' },
              { icon: FiLinkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
              { icon: FiCode, href: socialLinks.leetcode, label: 'LeetCode' },
              { icon: FiMail, href: socialLinks.email, label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.div
                key={label}
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors block"
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {label}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

